import React, { useEffect, useState } from "react";
import {
  Button,
  MenuItem,
  Paper,
  Table,
  TableCell,
  TableRow,
  TextField,
} from "@mui/material";
import dataController from "../utils/DataController";
import { useNavigate } from "react-router-dom";
export default function EventTable() {
  const API_URL = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("jwt");
  const dc = new dataController();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
 

  const fetchData = async () => {
    dc.GetData(API_URL + "/api/getAllUsers", accessToken)
      .then((resp) => {
        console.log(resp.data.data);
        setUsers(resp.data.data);
        console.log("set users");
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    fetchData();
  }, []);
/*
  const users = [
    {
      username: 'johndoe123',
      roleId: 1,
      eMail: 'johndoe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      organizerName: 'ABC Events',
      countryName: 'United States',
    },
    {
      username: 'janedoe456',
      roleId: 0,
      eMail: 'jane@example.com',
      firstName: 'Jane',
      lastName: 'Doe',
      organizerName: 'XYZ Conferences',
      countryName: 'Canada',
    },
    {
      username: 'alexsmith789',
      roleId: 2,
      eMail: 'alex@example.com',
      firstName: 'Alex',
      lastName: 'Smith',
      organizerName: 'Event Planners Inc.',
      countryName: 'Australia',
    },
  ];
*/
const [filterValue, setFilterValue] = useState('');
  const [filterBy, setFilterBy] = useState('username');
  

  const filterFunction = (user) => {
    switch (filterBy) {
      case 'username':
        return user.username.toLowerCase().includes(filterValue.toLowerCase());
      case 'organizer':
        if(user.organizerName !== undefined)
          return user.organizerName.toLowerCase().includes(filterValue.toLowerCase());
        return
      case 'firstName':
        if(user.firstName !== undefined)
          return user.firstName.toLowerCase().includes(filterValue.toLowerCase());
        return
      default:
        return true; // If no specific filterBy is selected, include all users
    }
  };

  const handleFilterSubmit = () => {
    const filteredUsers = users.filter(filterFunction);
    console.log("bok")
    console.log(filteredUsers)
    // Now you can use the filteredUsers array as needed
    // Example: setFilteredUsers(filteredUsers);
  };

  const handleFilterByChange = (e) => {
    setFilterBy(e.target.value);
  };
  return (
    <Paper sx={{ padding: "2rem" }}>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <TextField label="Filter" onChange={(e) => setFilterValue(e.target.value)}></TextField>
        <TextField label="Filter by:" select defaultValue="username" onChange={handleFilterByChange} >
          <MenuItem value="username">Username</MenuItem>
          <MenuItem value="organizer">Organizer Name</MenuItem>
          <MenuItem value="firstName">First Name</MenuItem>
        </TextField>

       
      </div>

      <Table>
        <TableRow>
          <TableCell>Username</TableCell>
          <TableCell>Role</TableCell>
          <TableCell>eMail</TableCell>
          <TableCell>First name</TableCell>
          <TableCell>Last name</TableCell>
          <TableCell>Organizer name</TableCell>
          <TableCell>Country</TableCell>
          <TableCell></TableCell>
        </TableRow>

        {users ? (
          users.filter(filterFunction).map((user) => (
            <TableRow>
              <TableCell>{user.username ? user.username : "-"}</TableCell>
              <TableCell>
                {user.roleId == 1
                  ? "Organizer"
                  : user.roleId == 0
                  ? "Visitor"
                  : "Administrator"}
              </TableCell>
              <TableCell>{user.eMail ? user.eMail : "-"}</TableCell>
              <TableCell>{user.firstName ? user.firstName : "-"}</TableCell>
              <TableCell>{user.lastName ? user.lastName : "-"}</TableCell>
              <TableCell>
                {user.organizerName ? user.organizerName : "-"}
              </TableCell>
              <TableCell>{user.countryName ? user.countryName : "-"}</TableCell>
              <TableCell>{user.roleId == 1 
                  ? <>{user.events == 1 ?<Button>Browse events</Button>:null} {user.subscription == 1 ? <Button>Cancle subscription</Button>:null}</>
                  : user.roleId == 0
                  ? <><Button>Make Administrator</Button> <Button>Delete account</Button></>
                  : null}</TableCell>
            </TableRow>
          ))
        ) : (
          <></>
        )}
      </Table>
    </Paper>
  );
}

