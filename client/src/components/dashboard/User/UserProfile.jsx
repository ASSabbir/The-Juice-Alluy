import React from 'react';

const UserProfile = () => {
    return (
        <div className="  text-white  min-h-screen">

      <div className="relative bg-backgrondDark h-96 flex flex-col justify-center items-center">
        <div className="absolute inset-0 opacity-50 brightness-50 bg-[url('/business-banner.jpg')] bg-bottom bg-no-repeat bg-cover filter grayscale "></div>
        <h2 className="relative text-5xl text-center font-moglan text-white  ">
          My Profile
        </h2>
        <div className="breadcrumbs  text-white text- font-urbanist mt-4">
          
        </div>
      </div>

      <div className="mt-[5vw] px-[9vw]">
        <div className="flex justify-between py-6">
        User Info 
        </div>
      </div>

    </div>
  );
};

export default UserProfile;