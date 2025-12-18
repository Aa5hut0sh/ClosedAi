import axios from "axios";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const SendMoney = () => {
  const [searchParams]= useSearchParams();
  const id = searchParams.get("id");
  const name = searchParams.get("name");

  const [balance , setBalance]= useState(0);

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white rounded-lg shadow-md p-8 w-80 text-center">
        <h2 className="text-2xl font-semibold mb-6">Send Money</h2>

    
        <div className="flex items-center justify-center space-x-3 mb-6">
          <div className="bg-green-500 text-white font-bold rounded-full w-10 h-10 flex items-center justify-center">
            {name[0].toUpperCase()}
          </div>
          <span className="text-lg font-medium text-gray-800">
            {name}
          </span>
        </div>

      
        <div className="text-left mb-6">
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Amount (in ₹)
          </label>
          <input
            type="number"
            onChange={(e)=>{
              setBalance(e.target.value);
            }}
            placeholder="Enter amount"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>


        <button onClick={async ()=>{
          axios.post(`${API_BASE_URL}/account/transfer` , {
            amount :balance ,
            to:id
          } , {
            headers:{
              Authorization:"Bearer " + localStorage.getItem("token")
            }
          })
        }}className="w-full bg-green-500 text-white font-semibold py-2 rounded-lg hover:bg-green-600 transition">
          Initiate Transfer
        </button>
      </div>
    </div>
  );
};

