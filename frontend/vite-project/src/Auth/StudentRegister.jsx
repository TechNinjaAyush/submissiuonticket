import React from "react";
import { useState } from "react";

const StudentRegister = () => {
  const [name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [roll_no, setRoll] = useState("");
  const [Batch, setBatch] = useState("");
  const [Div, setDiv] = useState("");
  const [Password, setPass] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    console.log(name);
  }

  return (
    <div>
      <form onSubmit={submitHandler}>
        <div>
          <label htmlFor="name">Enter The Name</label>
          <br />
          <input
            type="text"
            id="name"
            value={name}
            name="name"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <br />

          <label htmlFor="Email">mail</label>
          <br />
          <input
            type="email"
            id="Email"
            name="Email"
            value={Email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <br />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={Password}
            onChange={(e) => {
              setPass(e.target.value);
            }}
            id="password"
          />
          <br />
          <label htmlFor="roll_id">Enter your roll_no</label>
          <input
            type="Number"
            min={4}
            value={roll_no}
            onChange={(e) => setRoll(e.target.value)}
            id="roll_no"
            name="roll_no"
          />
          <br />
          <label htmlFor="batch">Enter Batch</label>
          <input
            type="text"
            name="batch"
            value={Batch}
            onChange={(e) => {
              setBatch(e.target.value);
            }}
            id="batch"
          />
          <br />
          <label htmlFor="division">Enter Division</label>
          <input
            type="text"
            name="Div"
            value={Div}
            onChange={(e) => {
              setDiv(e.target.value);
            }}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default StudentRegister;
