const express = require('express');
const cors = require('cors');
const k8s = require('@kubernetes/client-node');

const app = express();
app.use(cors());
app.use(express.json());

// Connexion au cluster K8s
const kc = new k8s.KubeConfig();
kc.loadFromDefault(); // lit automatiquement ton kubeconfig Minikube

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
const appsApi = kc.makeApiClient(k8s.AppsV1Api);

// GET tous les pods
app.get('/api/pods', async (req, res) => {
  try {
    const response = await k8sApi.listPodForAllNamespaces();
    res.json(response.items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET tous les services
app.get('/api/services', async (req, res) => {
  try {
    const response = await k8sApi.listServiceForAllNamespaces();
    res.json(response.items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET tous les deployments
app.get('/api/deployments', async (req, res) => {
  try {
    const response = await appsApi.listDeploymentForAllNamespaces();
    res.json(response.items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET les nodes
app.get('/api/nodes', async (req, res) => {
  try {
    const response = await k8sApi.listNode();
    res.json(response.items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log('Backend K8s running on http://localhost:3000');
});