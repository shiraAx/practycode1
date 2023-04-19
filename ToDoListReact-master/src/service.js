import axios from "axios";

// const apiClient=axios.defaults.baseURL = process.env.REACT_APP_API_URL;
// console.log('process.env.API_URL', process.env.REACT_APP_API_URL)

const apiClient = axios.create({
  baseURL: "https://lastnewtodoapi.onrender.com/swagger",
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(error);
    return Promise.reject(error);
  }
);

export default {
  getTasks: async () => {
    const result = await apiClient.get(`/items`);
    return result.data;
  },

  addTask: async (name) => {
    console.log("addTask", name);
    const result = await apiClient.post(`/todoitems`, {
      name,
      isComplete: false,
    });
    return result.data;
  },

  setCompleted: async (itemId, name, isComplete) => {
    console.log("setCompleted", isComplete);
    const result = await apiClient.put(
      `/todoitems/${itemId}?name=${name}&isComplete=${isComplete}`
    );
    return result;
  },
  deleteTask: async (taskId) => {
    console.log("deleteTask");
    console.log(taskId);
    const result = await apiClient.delete(`/todoitems/${taskId}`);
    return result.data;
  },
};
