import React, { useState, useEffect } from "react";
import { useAuth } from "../firebase/AuthContext";
import { fetchClassAssignments } from "../firebase/DatabaseFunctions";
import { useParams } from "react-router-dom";
const CoachAssignmentView = () => {
  const { id: classCode, assignmentId } = useParams();
  const [assignment, setAssignment] = useState(null);
  useEffect(() => {
    const temp = async () => {
      const data = await fetchClassAssignments(classCode);
      const foundAssignment = data.find((item) => item.id === assignmentId);
      setAssignment(foundAssignment);
    };

    temp();
  }, []);

  return <>{assignment && JSON.stringify(assignment)}</>;
};
export default CoachAssignmentView;
