import { useState } from "react";

function Navbar() {
  const [activeTab, setActiveTab] = useState("Level 1");
  const tabs = ["Level 1", "Level 2"];

  return (
    <nav className="flex justify-center rounded-lg bg-[#2f2f2f] p-4 w-full">
      {/* <div className="flex items-center">Logo</div> */}
      <div className="flex bg-[#3a3a3a] rounded-full p-1 gap-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full transition
              ${
                activeTab === tab
                  ? "bg-[#2b2b2b] text-yellow-400"
                  : "text-white hover:text-white"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>
      {/* <div></div> */}
    </nav>
  );
}

export default Navbar;
