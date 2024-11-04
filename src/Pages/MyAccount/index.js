import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import EditProfile from '../../Components/EditProfile'; // Import the EditProfile component
import ChangePassword from '../../Components/ChangePassword'; // Import the ChangePassword component
import OtherSettings from '../../Components/OtherSettings'; // Import the OtherSettings component

const MyAccount = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [value, setValue] = useState(0); // For tabs
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLogin(true);
      // Fetch user data here if needed
    } else {
      navigate("/sign-in");
    }
  }, [navigate]);

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  return isLogin ? (
    <section className='section'>
      <div className='container'>
        <Typography variant="h4" gutterBottom>
          My Account
        </Typography>
        <Box sx={{ width: '100%' }}>
          <Tabs value={value} onChange={handleTabChange}>
            <Tab label="Edit Profile" />
            <Tab label="Change Password" />
            <Tab label="Settings" />
          </Tabs>
          <TabPanel value={value} index={0}>
            <EditProfile />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <ChangePassword />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <OtherSettings />
          </TabPanel>
        </Box>
      </div>
    </section>
  ) : null;
};

// TabPanel Component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default MyAccount;
