%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% JSON NETWORK GENERATOR
% It generates json equivalent of MATPOWER case files.
% Essentially any IEEE power network present in MATPOWER is converted to
% a json file with my custom key-value pairs.
% USAGE:
% 1. Say, I want to convert IEEE-30 bus network to a json file which will
% contain all the network info.
% 2. Change the 'casefileName' to 'case30'
% 3. Run the script. It will create 'case30.json' in working directory.
%
% Still in its nacency. But it works!!!
% There are many improvements that can be done which I will do when I will
% get spare time.
% Author: Arnab Dey
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
define_constants;
%%%%%%%%%%%%%%% CHANGE THE CASE FILE AS REQUIRED %%%%%%%%%%%%%%%%%%%%%%%%%%
casefileName = 'case5';
mpc = loadcase(casefileName);
n_bus = size(mpc.bus, 1);
port_offset = 3000;
default_ip = 'localhost';
global USECASE GRAPH_TYPE;
USECASE = 3; % Power network
GRAPH_TYPE = 0; % undirected graph
default_status = 1;
default_profile_img = 'NA';
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% JSON Fields for each agents: here each bus is an agent
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
id = cell(n_bus, 1);
secure_key = cell(n_bus, 1);
ip = cell(n_bus, 1);
port = cell(n_bus, 1);
type = cell(n_bus, 1);
status = cell(n_bus, 1);
name = cell(n_bus, 1);
profile_img = cell(n_bus, 1);
network = cell(n_bus, 1);
data = cell(n_bus, 1);
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% Load values to json fields
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
for bus=1:n_bus
    id{bus} = mpc.bus(bus, BUS_I);
    secure_key{bus} = '9999';
    ip{bus} = default_ip;
    port{bus} = port_offset-1+mpc.bus(bus, BUS_I);
    type{bus} = sprintf('%d:%d', USECASE, getAgentType(mpc.bus(bus, BUS_TYPE)));
    status{bus} = default_status;
    name{bus} = sprintf('%s_%d', 'bus', mpc.bus(bus, BUS_I));
    profile_img{bus} = default_profile_img;
    network{bus} = getAgentNetwork(mpc, mpc.bus(bus, BUS_I),...
        default_ip, port_offset);
    data{bus} = getAgentData(mpc, mpc.bus(bus, BUS_I));
end
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% JSON encoding and saving to files is done here
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
encoded_json = jsonencode(table(id, secure_key, ip, port, type, status,...
    name, profile_img, network, data));
encoded_json = prettyjson(encoded_json);
jsonfile_name = sprintf('%s.json', casefileName);
fid = fopen(jsonfile_name,'w');
fprintf(fid, encoded_json);
fclose('all');
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% Static function definitions
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% This function constructs agent type string for each agent
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
function type = getAgentType(bus_type)
    define_constants;
    if (REF == bus_type)
        type = 0;
    elseif (PQ == bus_type)
        type = 1;
    elseif (PV == bus_type)
        type = 2;
    else
        type = 3;
    end
end
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% This function constructs network object for each agent
% It returns an array of object in which each element corresponds to
% each node the agent is connected to in the graph
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
function network = getAgentNetwork(mpc, bus, default_ip, port_offset)
    define_constants;
    global USECASE GRAPH_TYPE;
    % Get subgraph for this particular bus
    % Power network is undirected. So, either fetch from_bus
    % or to_bus. Using from_bus here.
    to_network = mpc.branch(find(mpc.branch(:, F_BUS)==bus),:);
    n_node = size(to_network, 1);
    ip = cell(n_node,1);
    port = cell(n_node,1);
    access_code = cell(n_node, 1);
    signature = cell(n_node, 1);
    status = cell(n_node, 1);
    link_weight = cell(n_node, 1);
    default_access_code = '0000';
    default_signature = 'friend';
    default_status = 1;
    default_own_weight = 0;
    for node=1:n_node
        to_node = to_network(node, T_BUS);
        ip{node} = default_ip;
        port{node} = port_offset-1+to_node;
        access_code{node} = default_access_code;
        signature{node} = default_signature;
        status{node} = default_status;
        link_weight{node} = sprintf('%d:%f:%f:%f',...
            USECASE,to_network(node, BR_R), to_network(node, BR_X),...
            to_network(node, BR_B));
    end
    network = struct('type', GRAPH_TYPE, 'to', table(ip, port, access_code,...
        signature, status, link_weight), 'own',...
        struct('weight', default_own_weight));
end
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% This function constructs data object for each agent
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
function data = getAgentData(mpc, bus)
    define_constants;
    is_gen_bus = false;
    if (any(mpc.gen(:, GEN_BUS)) == bus)
        is_gen_bus = true;
        gen_data = mpc.gen(mpc.gen(:, GEN_BUS)==bus,:);
        gen_struct = struct('is_gen_bus', 1, 'status', gen_data(1, GEN_STATUS),...
            'pg', gen_data(1, PG), 'qg', gen_data(1, QG),...
            'max_pg', gen_data(1, PMAX), 'min_pg', gen_data(1, PMIN),...
            'max_qg', gen_data(1, QMAX), 'min_qg', gen_data(1, QMIN),...
            'vg', gen_data(1, VG), 'mbase', gen_data(1, MBASE));
    end
    load_data = mpc.bus(mpc.bus(:, BUS_I)==bus,:);
    load_struct = struct('is_load_bus', 1, 'status', 1,...
        'pd', load_data(1, PD), 'qd', load_data(1, QD));
    if (is_gen_bus)
        data = struct('version', mpc.version, 'unit', 'pu',...
        'ang_unit', 'rad', 'base_mva', mpc.baseMVA,...
        'base_kv', mpc.bus(bus, BASE_KV), 'gen_bus', gen_struct,...
        'load_bus', load_struct, 'v_mag', mpc.bus(mpc.bus(:, BUS_I)==bus,VM),...
        'v_ang', mpc.bus(mpc.bus(:, BUS_I)==bus,VA));
    else
        data = struct('version', mpc.version, 'unit', 'pu',...
        'ang_unit', 'rad', 'base_mva', mpc.baseMVA,...
        'base_kv', mpc.bus(bus, BASE_KV),...
        'load_bus', load_struct, 'v_mag', mpc.bus(mpc.bus(:, BUS_I)==bus,VM),...
        'v_ang', mpc.bus(mpc.bus(:, BUS_I)==bus,VA));
    end
end


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% The following function is downloaded from a wonderful
% contribution to MATWORKS by Yury Bondarenko.
% Follow the link below:
% https://www.mathworks.com/matlabcentral/fileexchange/72667-prettyjson-m
% The github version can be found below:
% https://github.com/ybnd/prettyjson.m
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
function less_ugly = prettyjson(ugly)
% Makes JSON strings (relatively) pretty
% Probably inefficient
% Mostly meant for structures with simple strings and arrays;  
% gets confused and !!mangles!! JSON when strings contain [ ] { or }. 
    MAX_ARRAY_WIDTH = 80;
    TAB = '    ';
    
    ugly = strrep(ugly, '{', sprintf('{\n')); 
    ugly = strrep(ugly, '}', sprintf('\n}')); 
    ugly = strrep(ugly, ',"', sprintf(', \n"'));
    ugly = strrep(ugly, ',{', sprintf(', \n{'));
    indent = 0;
    lines = splitlines(ugly);
    for i = 1:length(lines)
        line = lines{i};
        next_indent = 0;
        % Count brackets
        open_brackets = length(strfind(line, '['));
        close_brackets = length(strfind(line, ']'));
        open_braces = length(strfind(line, '{'));
        close_braces = length(strfind(line, '}'));
        if close_brackets > open_brackets || close_braces > open_braces
            indent = indent - 1;
        end
        if open_brackets > close_brackets
            line = strrep(line, '[', sprintf('[\n'));
            next_indent = 1;
        elseif open_brackets < close_brackets
            line = strrep(line, ']', sprintf('\n]'));
            next_indent = -1;
        elseif open_brackets == close_brackets && length(line) > MAX_ARRAY_WIDTH
            first_close_bracket = strfind(line, ']');
            if first_close_bracket > MAX_ARRAY_WIDTH % Just a long array -> each element on a new line
                line = strrep(line, '[', sprintf('[\n%s', TAB)); 
                line = strrep(line, ']', sprintf('\n]')); 
                line = strrep(line, ',', sprintf(', \n%s', TAB)); % Add indents!
            else % Nested array, probably 2d, first level is not too wide -> each sub-array on a new line
                line = strrep(line, '[[', sprintf('[\n%s[', TAB)); 
                line = strrep(line, '],', sprintf('], \n%s', TAB)); % Add indents!
                line = strrep(line, ']]', sprintf(']\n]'));
            end
        end
        sublines = splitlines(line);
        for j = 1:length(sublines)
            if j > 1   % todo: dumb to do this check at every line...
                sublines{j} = sprintf('%s%s', repmat(TAB, 1, indent+next_indent), sublines{j});
            else
                sublines{j} = sprintf('%s%s', repmat(TAB, 1, indent), sublines{j});     
            end
        end
        if open_brackets > close_brackets || open_braces > close_braces 
            indent = indent + 1;
        end
        indent = indent + next_indent;
        lines{i} = strjoin(sublines, newline); 
    end
    less_ugly = strjoin(lines, newline);
end
