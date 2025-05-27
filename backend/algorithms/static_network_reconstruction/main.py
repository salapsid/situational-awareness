###########################################################################
# Imports
###########################################################################
import numpy as np
# import matplotlib.pyplot as plt
import ReadNormalizedDataset
import utils
# from sklearn import preprocessing
import os
###########################################################################
# Flags & params
###########################################################################
isNormEnabled = False
isTlEnabled = True
isScalingEnabled = False
isPlotReqd = False
isTauTuneReqd = True

# Grid params #
n_buses = 33
slackBusNum = 0
scaleFactorV = 1. # Default value
scaleFactorTheta = 1. # Default value
PATH_TO_APPEND = 'C:/Users/chakr138/Aelios/situationalAwareness'
###########################################################################
# Dataset location
###########################################################################
dataFileVM = PATH_TO_APPEND + "/dataset/datasetVM.txt"
dataFileVA = PATH_TO_APPEND + "/dataset/datasetVA.txt"
datasetVM = np.loadtxt(dataFileVM, delimiter=",")
datasetVA = np.loadtxt(dataFileVA, delimiter=",")
datasetVM = utils.parseDataset(datasetVM, n_buses).T
datasetVA = utils.parseDataset(datasetVA, n_buses).T
branchData = np.loadtxt(PATH_TO_APPEND+'/backend/algorithms/static_network_reconstruction'+'/dataset/branch_data.txt', delimiter=",")
#####################################################################################
# JUST FOR TESTING
#####################################################################################
datasetVM = np.delete(datasetVM, (slackBusNum), axis=0)
datasetVA = np.delete(datasetVA, (slackBusNum), axis=0)
###########################################################################
# Extract Hgb matrix of actual grid to calculate scaling factor
###########################################################################
if (isScalingEnabled == True):
    Hgb = utils.getHgbMatrix(branchData, n_buses, slackBusNum)
    # np.savetxt('./Hgb.txt', Hgb)
    datasetVTheta = np.vstack((datasetVM, datasetVA)).T
    normalizedDatasetVTheta = ReadNormalizedDataset.filterStaticData(datasetVTheta)
    datasetP = np.loadtxt(PATH_TO_APPEND + '/dataset/datasetP.txt', delimiter=",")
    datasetQ = np.loadtxt(PATH_TO_APPEND + '/dataset/datasetQ.txt', delimiter=",")
    datasetP = np.delete(datasetP, (slackBusNum), axis=0)
    datasetQ = np.delete(datasetQ, (slackBusNum), axis=0)
    datasetPQ = np.vstack((datasetP, datasetQ)).T
    # Test check #
    temp = np.cov(datasetPQ, rowvar=False, bias=False)
    cond = np.linalg.cond(temp)
    HgbInverse = np.linalg.inv(Hgb)
    linearModelVMVA = (HgbInverse @ datasetPQ.T).T
    linearModelCov = np.cov(linearModelVMVA, rowvar=False, bias=False)
    actualCov = np.cov(normalizedDatasetVTheta, rowvar=False, bias=False)
    scaleFactorV = np.sqrt(linearModelCov[0, 0]/actualCov[0, 0])
    scaleFactorTheta = np.sqrt(linearModelCov[-1, -1]/actualCov[-1, -1])
###########################################################################
# Scale V and Theta
###########################################################################
datasetVM = datasetVM*scaleFactorV
datasetVA = datasetVA*scaleFactorTheta
# normalizedDataset = ReadNormalizedDataset.filterStaticData(dataset)
###########################################################################
# Normalization
###########################################################################
ptsStart = -1#3000
sigmaFeat = np.ones(((n_buses-1)*2))
if (isNormEnabled == True):
    # normalizedDatasetVM = preprocessing.MinMaxScaler((0, 1)).fit_transform(datasetVM.T).T
    # normalizedDatasetVA = preprocessing.MinMaxScaler((0, 1)).fit_transform(datasetVA.T).T
    # dataset = np.vstack((normalizedDatasetVM[:, 0:pts], normalizedDatasetVA[:, 0:pts])).T
    datasetTemp = np.vstack((datasetVM[:, 0:ptsStart], datasetVA[:, 0:ptsStart])).T
    dataset, sigmaFeat = ReadNormalizedDataset.NormalizeDataset(datasetTemp)
    # normalizedDataset = normalizedDataset[:, ~np.all(normalizedDataset==0, axis=0)]
else:
    dataset = np.vstack((datasetVM[:, 0:ptsStart], datasetVA[:, 0:ptsStart])).T
normalizedDataset = ReadNormalizedDataset.filterStaticData(dataset)

###########################################################################
# Extract admittance matrix of actual grid
###########################################################################
gridActual = utils.getAdmittanceMatrix(branchData, n_buses, slackBusNum)
###########################################################################
# Learn topology
###########################################################################
H_arr = []
tau_idx_min = 0
prev_err = 100
if (isTlEnabled == True):
    if (True == isTauTuneReqd):
        tau_arr = np.linspace(0.08,0.2, 1000)
    else:
        tau_arr = np.array([0.3])
    error = np.zeros((tau_arr.shape[0]))
    cov = np.cov(normalizedDataset, rowvar=False, bias=False)
    # cov[np.abs(cov) < 1e-3] = 0
    if sigmaFeat.any() != None:
        cov = ReadNormalizedDataset.reformCovariance(cov,sigmaFeat)
    for tau in range(len(tau_arr)):
        H = utils.learnTopology(cov, tau_arr[tau])
        H_arr.append(H)
        err_tau = utils.getErrorPercentage(gridActual, H, slackBusNum)
        error[tau] = err_tau
        if err_tau < prev_err:
            tau_idx_min = tau
            prev_err = err_tau
    print('min error = ', np.min(error), ' and prev_err = ', prev_err)
    ppc_branch = utils.createPpcBranchMatrix(H_arr[tau_idx_min])
    ppc_branch = utils.createPpcBranchMatrix(gridActual)
    np.savetxt(PATH_TO_APPEND+'/dataset/ppc_branch.txt', ppc_branch)
    os.system("matlab -nodisplay -nosplash -nodesktop -r run('C:/Users/chakr138/Aelios/situationalAwareness/backend/algorithms/static_network_reconstruction/network_generator.m');exit;")
    print('Network generated!')
    if (True == isPlotReqd):
        fig = plt.figure()
        ax = fig.add_subplot(111)
        fig.subplots_adjust(left=.15, bottom=.16, right=.88, top=.97)

        ax.set_axisbelow(True)
        ax.minorticks_on()
        ax.grid(which='major', linestyle='-', linewidth='0.5')
        ax.grid(which='minor', linestyle="-.", linewidth='0.1')
        plt.plot(tau_arr, error, color='r', label='error')
        plt.legend()
        plt.show()