import { useState, useEffect } from "react";
import axios from "axios";
import baseurl from "../../../CrudOperations/customURl";

const apiBase = baseurl;

const useDemo = () => {
  const [checkpoints, setCheckpoints] = useState([]);
  const [formData, setFormData] = useState({
    DeputyCheckpointName: "",
    DistrictId: "",
    StateId: "",
    Pincode: "",
    CommunityId: "",
    Gender: "Male",
    LandMark: "",
    StartDate: "",
    EndDate: "",
    StartTime: "",
    EndTime: "",
    CheckpointSkills: [],
  });

  const [editCheckpoint, setEditCheckpoint] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCheckpoints = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${apiBase}/DeputyCheckpoint/GetDeputyCheckpoint`);
      setCheckpoints(res?.data?.Data || []);
    } catch (err) {
      console.error("Fetch Checkpoints Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCheckpoints();
  }, []);

  const submitForm = async () => {
    const endpoint = editCheckpoint
      ? `${apiBase}/DeputyCheckpoint/UpdateDeputyCheckpoint/${editCheckpoint.DeputyCheckpointId}`
      : `${apiBase}/DeputyCheckpoint/AddDeputyCheckpoint`;

    try {
      await axios.post(endpoint, {
        ...formData,
        DistrictId: parseInt(formData.DistrictId),
        StateId: parseInt(formData.StateId),
        CommunityId: parseInt(formData.CommunityId),
        Pincode: parseInt(formData.Pincode),
        NoOfDeputation: formData.CheckpointSkills.length, // 🔥 required logic
        CheckpointSkills: formData.CheckpointSkills.map((s) => ({
          SkillId: parseInt(s.SkillId),
        })),
      });

      fetchCheckpoints();
      resetForm();
    } catch (err) {
      console.error("Submit Checkpoint Error:", err);
    }
  };

 const handleEdit = (checkpoint) => {
  setFormData({
    DeputyCheckpointName: checkpoint.DeputyCheckpointName || "",
    DistrictId: String(checkpoint.DistrictId || ""),
    StateId: String(checkpoint.StateId || ""),
    Pincode: String(checkpoint.Pincode || ""),
    CommunityId: String(checkpoint.CommunityId || ""),
    Gender: checkpoint.Gender || "Male",
    LandMark: checkpoint.LandMark || "",
    StartDate: checkpoint.StartDate ? checkpoint.StartDate.split("T")[0] : "", // assuming ISO format
    EndDate: checkpoint.EndDate ? checkpoint.EndDate.split("T")[0] : "",
    StartTime: checkpoint.StartTime || "",
    EndTime: checkpoint.EndTime || "",
    CheckpointSkills: checkpoint.CheckpointSkills?.map(s => ({
      SkillId: s.SkillId?.toString() || ""
    })) || [],
  });

  setEditCheckpoint(checkpoint);
};


  const resetForm = () => {
    setFormData({
      DeputyCheckpointName: "",
      DistrictId: "",
      StateId: "",
      Pincode: "",
      CommunityId: "",
      Gender: "Male",
      LandMark: "",
      StartDate: "",
      EndDate: "",
      StartTime: "",
      EndTime: "",
      CheckpointSkills: [],
    });
    setEditCheckpoint(null);
  };

  return {
    checkpoints,
    formData,
    setFormData,
    submitForm,
    fetchCheckpoints,
    editCheckpoint,
    setEditCheckpoint,
    handleEdit,
    resetForm,
    loading,
  };
};

export default useDemo;
