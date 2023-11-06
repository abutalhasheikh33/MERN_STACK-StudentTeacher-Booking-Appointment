import React, { useState, useRef, useEffect } from "react";
import Navbar from "../../UI/Navbar";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
// import { BsChevronRight } from 'react-icons/bs';
import { toast } from "react-toastify";
// import teachersData from '../../../../data.json';
import axios from "axios";
function Student() {
  const navigate = useNavigate();
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  // const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [lectureDetails, setLectureDetails] = useState([]);
  // const [searchParams, setSearchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [teacherEmail, setTeacherEmail] = useState("");

  // data coming
  // const [teachers, setTeachers] = useState(teachersData.teachers);
  const [teachers, setTeachers] = useState([]);
  useEffect(() => {
    const emailAdd = localStorage.getItem("email");
    setEmail(emailAdd);
    console.log(emailAdd);
    // console.log(email)
    // if (email == "") {
    //   console.log(searchParams.get("q"))
    //   setEmail(searchParams.get("q"))
    // }
    // setSearchParams("")
    const fetchData = async () => {
      try {
        const jwtToken = localStorage.getItem("Student jwtToken");
        if (jwtToken == null) {
          navigate("/student/login");
        } else {
          // Make an HTTP request to fetch data from the API using Axios
          const response = await axios.get(
            "http://localhost:5000/api/v1/admin",
            {
              headers: {
                Authorization: `Bearer ${jwtToken}`,
              },
            }
          );
          // Update the state with the fetched data
          // console.log(response.data.data.users);
          setTeachers(response.data.data.users);
          console.log(response.data.data.users);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // useEffect(() => {

  // })

  const modalRef = useRef();

  const handleTeacherClick = (teacherName, subject) => {
    setSelectedTeacher(teacherName);
    setSelectedSubject(subject);
    // setIsModalOpen(true);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBooked = () => {
    if (selectedTeacher && selectedSubject) {
      const currentDate = new Date().toLocaleDateString();
      const currentTime = new Date().toLocaleTimeString();

      setLectureDetails((prevDetails) => [
        ...prevDetails,
        {
          teacher: selectedTeacher,
          subject: selectedSubject,
          date: currentDate,
          time: currentTime,
          // timeSlot: selectedTimeSlot,
        },
      ]);

      setTeachers((prevTeachers) =>
        prevTeachers.filter((teacher) => teacher.name !== selectedTeacher)
      );

      toast.success("Lecture booked successfully");

      // Reset selections
      setSelectedTeacher(null);
      setSelectedSubject(null);
      setSelectedTimeSlot(null);

      setIsModalOpen(false); // Close the modal
    } else {
      toast.success("Please select a time slot.");
    }
  };

  const [formData, setFormData] = useState({
    message: "",
  });

  function changeHandler(event) {
    const { name, value } = event.target;
    setFormData((prevFormData) => {
      // console.log(prevFormData);
      return {
        ...prevFormData,
        [name]: value,
      };
    });
  }
  // async function submitHandler(event) {
  //   event.preventDefault();
  //   console.log('Message Data');
  //   console.log(formData);
  //   setFormData({ message: '' });
  //   console.log(teacherEmail);

  // }


  async function submitHandler(event) {
    event.preventDefault();
    console.log("Message Data");
    console.log(formData);

    // Create the message object
    const messageObject = {
      to: teacherEmail, // Assuming teacherEmail contains the recipient email address
      messageText: formData.message, // Assuming formData.message contains the message text
    };

    // Log the message object
    console.log(messageObject);

    try {
      // Send a POST request to the specified URL
      const jwtToken = localStorage.getItem("Student jwtToken");
      const response = await axios.post(
        "http://localhost:5000/api/v1/messages",
        messageObject,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      if (response.status === 200) {
        // Handle a successful response, if needed
        // console.log('Message sent successfully.');
        toast.success("Message sent successfully");
      } else {
        // Handle an error response, if needed
        // console.error('Failed to send the message.');
        toast.error("Failed to send the message");
      }
    } catch (error) {
      // Handle any network or fetch-related errors
      console.error("An error occurred:", error);
    }

    // Reset the form data
    setFormData({ message: "" });

    console.log(teacherEmail);
  }

  // book appoinments
  const handleBookAppointment = async (appointmentId) => {
    console.log(appointmentId);
    try {
      const jwtToken = localStorage.getItem("Student jwtToken");
      console.log(jwtToken);
      const response = await axios.patch(
        `http://localhost:5000/api/v1/student/appointment/${appointmentId}`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      console.log("Appointment booked successfully:", response.data);
      // Handle any further actions if needed
    } catch (error) {
      console.error("Error booking appointment:", error);
    }
  };

  return (
    <>
      {/* <Navbar /> */}
      {/* time slot modal */}
      {/* <div
        className={`modal fade ${isModalOpen ? 'show' : ''}`}
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden={!isModalOpen}
        style={{ display: isModalOpen ? 'block' : 'none' }}
        ref={modalRef}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Update Lectures
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => setIsModalOpen(false)}
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3 row">
                  <label>Time Slot</label>
                  <div className="mt-1">
                    <button
                      type="button"
                      className={`btn ${selectedTimeSlot === '2pm-4pm' ? 'btn-primary' : 'btn-outline-secondary'}`}
                      onClick={() => setSelectedTimeSlot('2pm-4pm')}
                    >
                      2pm-4pm
                    </button>
                    <button
                      type="button"
                      className={`btn ${selectedTimeSlot === '5pm-6pm' ? 'btn-primary' : 'btn-outline-secondary'} ms-2`}
                      onClick={() => setSelectedTimeSlot('5pm-6pm')}
                    >
                      5pm-6pm
                    </button>
                    <button
                      type="button"
                      className={`btn ${selectedTimeSlot === '7pm-8pm' ? 'btn-primary' : 'btn-outline-secondary'} ms-2`}
                      onClick={() => setSelectedTimeSlot('7pm-8pm')}
                    >
                      7pm-8pm
                    </button>
                  </div>
                </div>
              </form>
              {selectedTeacher && selectedSubject && selectedTimeSlot && (
                <div>
                  <p>Selected Teacher: {selectedTeacher}</p>
                  <p>Selected Subject: {selectedSubject}</p>
                  <p>Selected Time Slot: {selectedTimeSlot}</p>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={() => {
                  if (selectedTimeSlot) {
                    handleBooked();
                    setIsModalOpen(false);
                  }
                }}
                disabled={!selectedTimeSlot}  // Disable the button if no time slot selected
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div> */}

      {/* message modal */}
      <div className="modal fade" id="messageModal" tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Message Modal</h5>
            </div>
            <form action="" onSubmit={submitHandler}>
              <div className="modal-body">
                <input
                  className="form-control"
                  type="text"
                  name="message"
                  value={formData.message}
                  onChange={changeHandler}
                  placeholder="Your Message Goes Here"
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                {/* <button type="button" className="btn btn-primary" data-bs-dismiss="modal">
                  Send Message
                </button> */}
                <input
                  type="submit"
                  value="Send Message"
                  className="btn btn-primary"
                  data-bs-dismiss="modal"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* header */}
      <div className="header-container shadow p-3 mb-5 bg-primary text-white">
        <div className="container d-flex justify-content-center">
          <p className="fs-1">Student Dashboard</p>
        </div>
      </div>

      {/* info table */}
      <div className="container py-4">
        <h2>Your Upcoming Lectures Details</h2>
        {/* <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit</p> */}
        <hr className="mt-0 mb-4" />
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">Sr.No</th>
              <th scope="col">Teacher</th>
              <th scope="col">Subject</th>
              <th scope="col">Date</th>
              <th scope="col">Time Slot</th>
              <th scope="col">Booking Time</th>
            </tr>
          </thead>
          <tbody>
            {lectureDetails.map((detail, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{detail.teacher}</td>
                <td>{detail.subject}</td>
                <td>{detail.date}</td>
                <td>{detail.timeSlot}</td>
                <td>{detail.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* card container */}
      <div className="container py-4">
        <div className="pagecontent">
          <h2>All teachers</h2>
          {/* <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit</p> */}
          <hr className="mt-0 mb-4" />
          <div
            className="d-flex flex-wrap justify-content-center"
            style={{ gap: "1rem" }}
          >
            {teachers.map((teacher, index) => (
              <div className="card" style={{ width: "18rem" }} key={index}>
                <img
                  src="https://static.vecteezy.com/system/resources/previews/002/406/452/non_2x/female-teacher-teaching-a-lesson-at-the-school-free-vector.jpg"
                  className="card-img-top"
                  alt="..."
                  style={{ height: "256px" }}
                />
                <div className="card-body">
                  <h5 className="card-title mb-3">Name: {teacher.name}</h5>
                  <p className="card-text">Subject: {teacher.subject}</p>
                  <p className="card-text">Email: {teacher.email}</p>
                  {/* Display scheduleAt for each appointment */}
                  {teacher.appointments.map((appointment, appointmentIndex) => (
                    <div key={appointmentIndex}>
                      <p>
                        Timing:{" "}
                        {new Date(appointment.scheduleAt).toLocaleTimeString(
                          [],
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                      <div className="d-flex justify-content-around">
                        <button
                          className="bg-primary text-white rounded p-2 border-0"
                          onClick={() => handleBookAppointment(appointment._id)}
                        >
                          Book Appointment
                        </button>
                        <button
                          className="bg-primary text-white rounded p-2 border-0"
                          type="button"
                          data-bs-toggle="modal"
                          data-bs-target="#messageModal"
                          onClick={() => setTeacherEmail(teacher.email)}
                        >
                          Message
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Student;
