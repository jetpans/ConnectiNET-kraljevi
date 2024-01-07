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
export default function UserTable() {
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
  return (
    <Paper sx={{ padding: "2rem" }}>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <TextField label="Filter" ></TextField>
        <TextField label="Filter by:" select defaultValue="username" >
          <MenuItem value="username">Username</MenuItem>
          <MenuItem value="organizer">Organizer Name</MenuItem>
          <MenuItem value="firstName">First Name</MenuItem>
        </TextField>

        <Button variant="contained" > Search...</Button>
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
          users.map((user) => (
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
                  ? <><Button>Browse events</Button> <Button>Cancle subscription</Button></>
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
