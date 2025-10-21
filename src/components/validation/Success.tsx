import React from "react";

const Success = ({children} : {children: React.ReactNode}) => {
    return (
        <>
            <div className="text-center px-1 py-2 mt-1 text-[#3c763d] bg-[#d6e9c6] rounded border border-[#d6e9c6]">
                {children}
            </div>
        </>
    );
};

export default Success;