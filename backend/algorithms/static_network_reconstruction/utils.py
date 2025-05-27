###########################################################################
# Imports
###########################################################################
import numpy as np
import scipy as scp
from scipy.sparse.linalg import inv

def getCorrFromCovariance(covariance):
    v = np.sqrt(np.diag(covariance))
    outer_v = np.outer(v, v)
    correlation = covariance / outer_v
    correlation[covariance == 0] = 0
    return correlation
def getAdmittanceMatrix(branch_data, n_buses, slackBusNum):
    H = np.zeros((n_buses,n_buses))
    for idx in range(branch_data.shape[0]):
        fbus = int(branch_data[idx, 0])-1
        tbus = int(branch_data[idx, 1])-1
        if (fbus != slackBusNum) and (tbus != slackBusNum):
            H[fbus, tbus] += 1
            H[tbus, fbus] += 1
    H = np.delete(H, (slackBusNum), axis=0)
    H = np.delete(H, (slackBusNum), axis=1)
    return H

def getHgbMatrix(branch_data, n_buses, slackBusNum):
    BR_R = 2
    BR_X = 3
    Hg = np.zeros((n_buses, n_buses))
    Hb = np.zeros((n_buses, n_buses))
    for idx in range(branch_data.shape[0]):
        fbus = int(branch_data[idx, 0]) - 1
        tbus = int(branch_data[idx, 1]) - 1
        if (fbus != slackBusNum) and (tbus != slackBusNum):
            z = branch_data[idx, BR_R]+branch_data[idx,BR_X]*1j
            g = np.real(1/np.conj(z))
            b = np.imag(1/np.conj(z))
            Hg[fbus,fbus] += g
            Hg[tbus,tbus] += g
            Hg[fbus, tbus] += -g
            Hg[tbus, fbus] += -g

            Hb[fbus,fbus] += b
            Hb[tbus,tbus] += b
            Hb[tbus,fbus] += -b
            Hb[fbus,tbus] += -b
        else:  # TODO: THIS SHOULD NOT BE AS PER MY UNDERSTANDING
            z = branch_data[idx, BR_R] + branch_data[idx, BR_X] * 1j
            g = np.real(1 / np.conj(z))
            b = np.imag(1 / np.conj(z))
            Hg[fbus, fbus] += g
            Hg[tbus, tbus] += g
            Hg[fbus, tbus] += -g
            # Hg[tbus, fbus] += -g

            Hb[fbus, fbus] += b
            Hb[tbus, tbus] += b
            # Hb[tbus, fbus] += -b
            Hb[fbus, tbus] += -b

    Hg = np.delete(Hg, (slackBusNum), axis=0)
    Hg = np.delete(Hg, (slackBusNum), axis=1)
    Hb = np.delete(Hb, (slackBusNum), axis=0)
    Hb = np.delete(Hb, (slackBusNum), axis=1)
    H_u = np.hstack((Hg, Hb))
    H_l = np.hstack((Hb, -Hg))
    H = np.vstack((H_u, H_l))
    return H

def learnTopology(sigma, tau):
    n_buses = int(sigma.shape[0]/2)
    # Invert sigma #
    cond = np.linalg.cond(sigma)
    # corr = getCorrFromCovariance(sigma)
    # sigma_inv = np.linalg.inv(sigma)
    sigma_inv = scp.linalg.inv(sigma)
    # sigma_inv[np.abs(sigma_inv)<1e-3] = 0
    u, s, v = np.linalg.svd(sigma)
    # sigma_inv = (sigma_inv/np.max(np.abs(sigma_inv),axis=1))
    # sigma_inv = sigma_inv/1e+5
    # Find block matrices corresponding to only v and theta separately #
    jVV = sigma_inv[0:n_buses, 0:n_buses]
    jTT = sigma_inv[n_buses:, n_buses:]
    statusMat = jVV+jTT
    np.savetxt('./statusMat.txt', statusMat)
    maxVal = np.max(np.abs(jVV+jTT),axis=1)
    # check = np.diag(statusMat)
    # maxVal = np.min(np.abs(statusMat[statusMat < 0]))/2
    # Grid admittance matrix #
    H = np.zeros((n_buses,n_buses))
    for busIdx_i in range(n_buses):
        for busIdx_j in range(n_buses):
            status = (statusMat[busIdx_i, busIdx_j])/maxVal[busIdx_i]
            if (status < -tau):
                H[busIdx_i,busIdx_j] += 1
    return H

def getErrorPercentage(gridAct, gridEst, slackBusNum):
    for idx in range(gridAct.shape[0]):
        gridAct[idx, idx] = 0
    diff = gridAct - gridEst
    error = np.count_nonzero(diff)
    totalBranches = np.count_nonzero(gridAct)
    error_percentage = error/totalBranches
    # print('Number of connections not identified = ', error_percentage)
    return error_percentage

def parseDataset(dataset, n_bus):
    if (None is dataset):
        print('Invalid dataset')
        return None
    parsed_dataset = np.zeros((dataset.shape[0], n_bus))
    for time_idx in range(int(dataset.shape[0])):
        for idx in range(int(dataset.shape[1]/2)):
            bus_num = int(dataset[time_idx, int(idx*2)])-1
            value = dataset[time_idx, int((idx*2)+1)]
            parsed_dataset[time_idx, bus_num] = value
    return parsed_dataset
def createPpcBranchMatrix(H):
    n_bus = H.shape[0]
    ppc_branch = []
    ppc_branch.append([1, 2])  # Append the slack bus
    for fbus in range(n_bus):
        # Get non-zero index
        nz_idx = np.where(H[fbus, :] != 0)[0]
        for tbus in nz_idx:
            ppc_branch.append([fbus+2, tbus+2])
    # Append additional elements
    ppc_branch = np.asarray(ppc_branch)
    ppc_branch = np.hstack((ppc_branch, np.zeros((ppc_branch.shape[0], 11))))
    return ppc_branch
