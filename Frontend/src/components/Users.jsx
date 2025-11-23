import { useEffect, useState } from "react";
import { Button } from "./Button";
import { InputBox } from "./InputBox";
import axios from "axios";
import {  useNavigate } from "react-router-dom";

export const Users = () => {
  const [users, setUsers] = useState([]); 
  const [filter , setFilter] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/user/bulk?filter=" + filter)
      .then((response) => {
        setUsers(response.data.users || []);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, [filter]);

  return (
    <div className="flex flex-col mt-6">
      <div className="font-bold text-lg">Users</div>

      <div className="my-2">
        <InputBox onChange={(e)=>{
            setFilter(e.target.value);
        }} placeholder="Search users..." />
      </div>

      <div className="flex flex-col gap-2">
        {users.length > 0 ? (
          users.map((user) => (
            <User user={user} key={user._id || user.id} />
          ))
        ) : (
          <div className="text-gray-500 text-sm text-center py-4">
            No users found
          </div>
        )}
      </div>
    </div>
  );
};

// ✅ User card component
function User({ user }) {
    const Navigate = useNavigate();
  return (
    <div className="flex justify-between items-center p-2 border border-gray-200 rounded-lg bg-white shadow-sm">
      <div className="flex items-center">
        <div className="rounded-full h-10 w-10 bg-slate-200 flex justify-center items-center mr-3">
          <div className="text-xl font-medium">
            {user.firstname?.[0]?.toUpperCase() || "?"}
          </div>
        </div>
        <div className="text-md font-semibold">
          {user.firstname} {user.lastname}
        </div>
      </div>
      <Button
        label="Send Money"
        onClick={() => {
          Navigate("/send?id=" + user._id + "&name="+user.firstname);
        }}
      />
    </div>
  );
}
