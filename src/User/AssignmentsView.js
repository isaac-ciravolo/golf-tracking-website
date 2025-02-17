import { useState, useEffect } from "react";
import { fetchUserAssignments } from "../firebase/DatabaseFunctions";
import { useAuth } from "../firebase/AuthContext";
const AssignmentsView = () => {
  const [assignments, setAssignments] = useState([]);
  const { currentUser: user } = useAuth();

  useEffect(() => {
    if (!user || !user.id) return;
    fetchUserAssignments(user.id).then((assignments) => {
      setAssignments(assignments);
    });
  }, [user]);

  return <>{assignments && JSON.stringify(assignments)}</>;
};

export default AssignmentsView;
