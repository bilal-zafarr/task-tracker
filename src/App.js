import axios from "axios";
import { useEffect, useState } from "react";
import AddTask from "./components/AddTask";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Tasks from "./components/Tasks";

function App() {
  const [showAddTasks, setShowAddTasks] = useState(false);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks();
      setTasks(tasksFromServer);
    };
    getTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await axios.get("http://localhost:5000/tasks");
    return res.data;
  }

  const fetchTask = async (id) => {
    const res = await axios.get(`http://localhost:5000/tasks/${id}`);
    return res.data;
  }

  //Add Task
  const addTask = async ({ text, day, reminder }) => {
    const res = await axios.post("http://localhost:5000/tasks", { text, day, reminder });
    setTasks([...tasks, res.data]);
  };

  //Delete Task
  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:5000/tasks/${id}`);
    setTasks(tasks.filter((task) => task.id !== id));
  };

  //Toggle Reminder
  const toggleReminder = async (id) => {
    const taskToToggle = await fetchTask(id);
    const updTask = { ...taskToToggle, reminder: !taskToToggle.reminder };
    const res = await axios.put(`http://localhost:5000/tasks/${id}`, updTask);
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, reminder: res.data.reminder } : task
      )
    );
  };

  return (
    <div className="container">
      <Header
        onAdd={() => setShowAddTasks(!showAddTasks)}
        showAdd={showAddTasks}
      />
      {showAddTasks && <AddTask onAdd={addTask} />}
      {tasks.length > 0 ? (
        <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder} />
      ) : (
        <p>No Task To Show</p>
      )}
      <Footer />
    </div>
  );
}

export default App;
