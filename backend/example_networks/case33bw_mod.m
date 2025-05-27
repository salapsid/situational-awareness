function mpc = case33bw
%CASE33BW  Power flow data for 33 bus distribution system from Baran & Wu
%    Please see CASEFORMAT for details on the case file format.
%
%    Data from ...
%       M. E. Baran and F. F. Wu, "Network reconfiguration in distribution
%       systems for loss reduction and load balancing," in IEEE Transactions
%       on Power Delivery, vol. 4, no. 2, pp. 1401-1407, Apr 1989.
%       doi: 10.1109/61.25627
%       URL: http://doi.org/10.1109/61.25627

%% MATPOWER Case Format : Version 2
mpc.version = '2';

%%-----  Power Flow Data  -----%%
%% system MVA base
mpc.baseMVA = 100;

%% bus data
%	bus_i	type	Pd	Qd	Gs	Bs	area	Vm	Va	baseKV	zone	Vmax	Vmin
mpc.bus = [  %% (Pd and Qd are specified in kW & kVAr here, converted to MW & MVAr below)
	1	3	0	0	0	0	1	1	0	12.66	1	1	1;
	2	1	100	60	0	0	1	1	0	12.66	1	1.1	0.9;
	3	1	90	40	0	0	1	1	0	12.66	1	1.1	0.9;
	4	1	120	80	0	0	1	1	0	12.66	1	1.1	0.9;
	5	1	60	30	0	0	1	1	0	12.66	1	1.1	0.9;
	6	1	60	20	0	0	1	1	0	12.66	1	1.1	0.9;
	7	1	200	100	0	0	1	1	0	12.66	1	1.1	0.9;
	8	1	200	100	0	0	1	1	0	12.66	1	1.1	0.9;
	9	1	60	20	0	0	1	1	0	12.66	1	1.1	0.9;
	10	1	60	20	0	0	1	1	0	12.66	1	1.1	0.9;
	11	1	45	30	0	0	1	1	0	12.66	1	1.1	0.9;
	12	1	60	35	0	0	1	1	0	12.66	1	1.1	0.9;
	13	1	60	35	0	0	1	1	0	12.66	1	1.1	0.9;
	14	1	120	80	0	0	1	1	0	12.66	1	1.1	0.9;
	15	1	60	10	0	0	1	1	0	12.66	1	1.1	0.9;
	16	1	60	20	0	0	1	1	0	12.66	1	1.1	0.9;
	17	1	60	20	0	0	1	1	0	12.66	1	1.1	0.9;
	18	1	90	40	0	0	1	1	0	12.66	1	1.1	0.9;
	19	1	90	40	0	0	1	1	0	12.66	1	1.1	0.9;
	20	1	90	40	0	0	1	1	0	12.66	1	1.1	0.9;
	21	1	90	40	0	0	1	1	0	12.66	1	1.1	0.9;
	22	1	90	40	0	0	1	1	0	12.66	1	1.1	0.9;
	23	1	90	50	0	0	1	1	0	12.66	1	1.1	0.9;
	24	1	420	200	0	0	1	1	0	12.66	1	1.1	0.9;
	25	1	420	200	0	0	1	1	0	12.66	1	1.1	0.9;
	26	1	60	25	0	0	1	1	0	12.66	1	1.1	0.9;
	27	1	60	25	0	0	1	1	0	12.66	1	1.1	0.9;
	28	1	60	20	0	0	1	1	0	12.66	1	1.1	0.9;
	29	1	120	70	0	0	1	1	0	12.66	1	1.1	0.9;
	30	1	200	600	0	0	1	1	0	12.66	1	1.1	0.9;
	31	1	150	70	0	0	1	1	0	12.66	1	1.1	0.9;
	32	1	210	100	0	0	1	1	0	12.66	1	1.1	0.9;
	33	1	60	40	0	0	1	1	0	12.66	1	1.1	0.9;
];

%% generator data
%	bus	Pg	Qg	Qmax	Qmin	Vg	mBase	status	Pmax	Pmin	Pc1	Pc2	Qc1min	Qc1max	Qc2min	Qc2max	ramp_agc	ramp_10	ramp_30	ramp_q	apf
mpc.gen = [
	1	0	0	10	-10	1	100	1	10	0	0	0	0	0	0	0	0	0	0	0	0;
];

%% branch data
%	fbus	tbus	r	x	b	rateA	rateB	rateC	ratio	angle	status	angmin	angmax
mpc.branch = [  %% (r and x specified in ohms here, converted to p.u. below)
	1	2	0.1922	0.1470	0	0	0	0	0	0	1	-360	360;
	2	3	0.34930	0.5511	0	0	0	0	0	0	1	-360	360;
	2	4	0.23660	0.2864	0	0	0	0	0	0	1	-360	360;
	4	5	0.3811	0.1941	0	0	0	0	0	0	1	-360	360;
	4	6	0.18190	0.17070	0	0	0	0	0	0	1	-360	360;
	%6	7	0.1872	0.26188	0	0	0	0	0	0	1	-360	360;
	7	8	0.47114	0.2351	0	0	0	0	0	0	1	-360	360;
	7	9	0.4300	0.27400	0	0	0	0	0	0	1	-360	360;
	7	10	0.4440	0.13400	0	0	0	0	0	0	1	-360	360;
	8	11	0.1966	0.1650	0	0	0	0	0	0	1	-360	360;
	8	12	0.3744	0.1238	0	0	0	0	0	0	1	-360	360;
	8	13	0.1680	0.1550	0	0	0	0	0	0	1	-360	360;
	9	14	0.15416	0.1129	0	0	0	0	0	0	1	-360	360;
	9	15	0.15910	0.15260	0	0	0	0	0	0	1	-360	360;
	9	16	0.17463	0.25450	0	0	0	0	0	0	1	-360	360;
	10	17	0.1190	0.17210	0	0	0	0	0	0	1	-360	360;
	10	18	0.1320	0.12740	0	0	0	0	0	0	1	-360	360;
	6	19	0.1640	0.1565	0	0	0	0	0	0	1	-360	360;
	19	20	0.15042	0.13554	0	0	0	0	0	0	1	-360	360;
	19	21	0.2095	0.24784	0	0	0	0	0	0	1	-360	360;
	19	22	0.17089	0.19373	0	0	0	0	0	0	1	-360	360;
	3	23	0.14512	0.2083	0	0	0	0	0	0	1	-360	360;
	3	24	0.18980	0.17091	0	0	0	0	0	0	1	-360	360;
	3	25	0.18960	0.27011	0	0	0	0	0	0	1	-360	360;
    %% loopy
    33	7	0.186	0.150	0	0	0	0	0	0	1	-360	360;
    11	31	0.166	0.310	0	0	0	0	0	0	1	-360	360;
    25	26	0.116	0.250	0	0	0	0	0	0	1	-360	360;
    
    %%
	6	26	0.2030	0.4034	0	0	0	0	0	0	1	-360	360;
	27	30	0.2842	0.5447	0	0	0	0	0	0	1	-360	360;
	26	28	0.1590	0.19337	0	0	0	0	0	0	1	-360	360;
	30	29	0.48042	0.3006	0	0	0	0	0	0	1	-360	360;
	28	30	0.55075	0.585	0	0	0	0	0	0	1	-360	360;
	30	31	0.5744	0.5630	0	0	0	0	0	0	1	-360	360;
	30	32	0.4105	0.5119	0	0	0	0	0	0	1	-360	360;
	32	33	0.1410	0.15302	0	0	0	0	0	0	1	-360	360;
% 	21	8	2.0000	2.0000	0	0	0	0	0	0	0	-360	360;
% 	9	15	2.0000	2.0000	0	0	0	0	0	0	0	-360	360;
% 	12	22	2.0000	2.0000	0	0	0	0	0	0	0	-360	360;
% 	18	33	0.5000	0.5000	0	0	0	0	0	0	0	-360	360;
% 	25	29	0.5000	0.5000	0	0	0	0	0	0	0	-360	360;
];
%%-----  OPF Data  -----%%
%% generator cost data
%	1	startup	shutdown	n	x1	y1	...	xn	yn
%	2	startup	shutdown	n	c(n-1)	...	c0
mpc.gencost = [
	2	0	0	3	0	20	0;
];


%% convert branch impedances from Ohms to p.u.
[PQ, PV, REF, NONE, BUS_I, BUS_TYPE, PD, QD, GS, BS, BUS_AREA, VM, ...
    VA, BASE_KV, ZONE, VMAX, VMIN, LAM_P, LAM_Q, MU_VMAX, MU_VMIN] = idx_bus;
[F_BUS, T_BUS, BR_R, BR_X, BR_B, RATE_A, RATE_B, RATE_C, ...
    TAP, SHIFT, BR_STATUS, PF, QF, PT, QT, MU_SF, MU_ST, ...
    ANGMIN, ANGMAX, MU_ANGMIN, MU_ANGMAX] = idx_brch;
Vbase = mpc.bus(1, BASE_KV) * 1e3;      %% in Volts
Sbase = mpc.baseMVA * 1e6;              %% in VA
mpc.branch(:, [BR_R BR_X]) = mpc.branch(:, [BR_R BR_X]) / (Vbase^2 / Sbase);

%% convert loads from kW to MW
mpc.bus(:, [PD, QD]) = mpc.bus(:, [PD, QD]) / 1e3;
