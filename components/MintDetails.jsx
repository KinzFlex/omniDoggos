import React from "react";
import images from "../assets";
import Image from "next/image";

const MintDetails = ({ minted, mintRate }) => (
  <div className="border-2 border-white-900 rounded-lg  p-6">

    <div className="flex text-center">
      <div className="rounded-lg shadow-md w-3/4 p-4">
        <div className="mb-4">
          <dt className="text-gray-200 text-l font-bold inline-block">
            Omni Doggos{" "}
          </dt>
        </div>
      </div>
      <div className="rounded-lg shadow-md w-1/4 p-4">
        <div className="mb-4">
          <dt className="text-gray-200 font-medium inline-block w-30 white-bg rounded-lg p-2 text-center">
            Price:
          </dt>
          <dd className="text-gray-100 inline-block gray-bg rounded-lg p-2 text-center">
            {mintRate}
          </dd>
        </div>
        <div className="mb-4">
          <dt className="text-gray-200 font-medium inline-block w-24 white-bg rounded-lg p-2 text-center">
            Minted:
          </dt>
          <dd className="text-gray-100 inline-block gray-bg rounded-lg p-2 text-center">
            {minted}/2
          </dd>
        </div>
      </div>
    </div>
  </div>
);

export default MintDetails;
