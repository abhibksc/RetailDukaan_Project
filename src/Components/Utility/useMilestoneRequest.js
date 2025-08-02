import { useState, useEffect } from "react";
import axios from "axios";
import { getPendingMilestoneRequests, getPendingSinupOfferReward_Requests } from "../CrudOperations/GetOperation";
import baseurl from "../CrudOperations/customURl";
import { Accept_Users_Milestone_Request_IN_DATABASE, claimSignupOfferReward } from "../CrudOperations/Update&Edit";
import { toast } from "react-toastify";

const apiBase = baseurl;

const useMilestoneRequest = () => {
  const [MilestoneRequests, setMilestoneRequests] = useState([]);
  const [sinupOfferReward_Requests, setSinupOfferReward_Requests] = useState([]);

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

  const fetchUserMileStoneRequest = async () => {
    try {
      setLoading(true);
      const res = await getPendingMilestoneRequests();
      console.log(res);

      setMilestoneRequests(res?.data || []);
    } catch (err) {
      console.error("Fetch  Error:", err);
    } finally {
      setLoading(false);
    }
  };


    const fetchUserSinUpOfferReward_Request = async () => {
    try {
      setLoading(true);
      const res = await getPendingSinupOfferReward_Requests();
      console.log(res);

      setSinupOfferReward_Requests(res?.data?.data || []);
    } catch (err) {
      console.error("Fetch  Error:", err);
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    fetchUserMileStoneRequest();
    fetchUserSinUpOfferReward_Request();

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

      fetchUserMileStoneRequest();
      resetForm();
    } catch (err) {
      console.error("Submit Checkpoint Error:", err);
    }
  };

  const Accept_Users_Milestone_Request = async (
    request_id,
    perform,
    status,
    playSuccessTone
  ) => {
    try {
      const response = await Accept_Users_Milestone_Request_IN_DATABASE(
        request_id,
        perform,
        status
      );
      console.log(response);

      if (
        response?.data?.message == "Milestone accepted and reward credited."
      ) {
        playSuccessTone();
        fetchUserMileStoneRequest();
      } else {
        toast.error(response?.data?.error || response?.data?.messsage || "err");
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.error || err?.response?.data?.messsage || "err"
      );
    }
  };


const singupOfferReward_claim = async (id, playSuccessTone) => {
  try {
    const response = await claimSignupOfferReward(id);
    console.log(response);

    const message = response?.data?.message;
    const errorMsg = response?.data?.error || response?.data?.message || "Something went wrong.";

    if (message === "Reward successfully claimed and credited to wallet.") {
      playSuccessTone();
      fetchUserSinUpOfferReward_Request();
    } else {
      toast.error(errorMsg);
    }
  } catch (err) {
    console.error("Caught error:", err);
    const backendError = err?.response?.data?.error || err?.response?.data?.message;
    toast.error(backendError || "An unexpected error occurred.");
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
      CheckpointSkills:
        checkpoint.CheckpointSkills?.map((s) => ({
          SkillId: s.SkillId?.toString() || "",
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
    sinupOfferReward_Requests,
fetchUserSinUpOfferReward_Request,
singupOfferReward_claim,

    MilestoneRequests,
    Accept_Users_Milestone_Request,

    formData,
    setFormData,
    submitForm,
    fetchUserMileStoneRequest,
    editCheckpoint,
    setEditCheckpoint,
    handleEdit,
    resetForm,
    loading,
  };
};

export default useMilestoneRequest;
