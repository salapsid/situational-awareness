import express from 'express';
import api_db from '../api/api_database.js';

const router = express.Router();

router.get('/agents', async (req, res) => {
    try {
        const agents = await api_db.api_getNetwork();
        res.json(agents);
    } catch (err) {
        res.status(500).json({error: String(err)});
    }
});

router.get('/agents/:id', async (req, res) => {
    try {
        const agent = await api_db.api_getAgent(req.params.id);
        if (!agent || agent.length === 0) {
            res.status(404).json({error: 'Agent not found'});
        } else {
            res.json(agent);
        }
    } catch (err) {
        res.status(500).json({error: String(err)});
    }
});

router.post('/agents', async (req, res) => {
    try {
        const created = await api_db.api_addAgent(req.body);
        res.status(201).json(created);
    } catch (err) {
        res.status(500).json({error: String(err)});
    }
});

router.put('/agents/:id', async (req, res) => {
    try {
        const updated = await api_db.api_updateAgentFields(req.params.id, req.body);
        res.json(updated);
    } catch (err) {
        res.status(500).json({error: String(err)});
    }
});

router.delete('/agents/:id', async (req, res) => {
    try {
        const result = await api_db.api_deleteAgent(req.params.id);
        res.json(result);
    } catch (err) {
        res.status(500).json({error: String(err)});
    }
});

export default router;
