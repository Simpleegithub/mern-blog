import { Sidebar } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { HiUser,HiArrowSmRight } from 'react-icons/hi';
import { Link, useLocation } from 'react-router-dom';

function DashSidebar() {
    const location = useLocation();
    const [tab, setTab] = useState("");
  
    useEffect(() => {
      const urlParams = new URLSearchParams(location.search);
      const tabFoundUrl = urlParams.get("tab");
      console.log("tabFoundUrl:", tabFoundUrl); // Log the tabFoundUrl
      if (tabFoundUrl) {
        setTab(tabFoundUrl);
      }
    }, [location.search]);
  
    console.log("tab state:", tab); 
    return (
        <Sidebar className='w-full md:w-56'>
            <Sidebar.Items>
                <Sidebar.ItemGroup>
                    <Link to='/dashboard?tab=profile'>
                    <Sidebar.Item active={tab=='profile'} icon={HiUser} label="User" labelColor='dark' onClick>
                        Profile
                    </Sidebar.Item>
                    </Link>
                    <Sidebar.Item  icon={HiArrowSmRight} className='cursor-pointer'>
                        logOut
                    </Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    );
}

export default DashSidebar;
