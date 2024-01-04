import * as React from "react";
import Avatar from "@mui/material/Avatar";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { Paper } from "@mui/material";
import dataController from "../utils/DataController";
import CardMedia from "@mui/material/CardMedia";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

import { useState, useContext, useEffect } from "react";
import { Block } from "@mui/icons-material";

export default function SubscribePage(props) {

   const handleClickCard = (event) =>{
    const kartica = document.getElementById("kartica");
    const opcija = document.getElementById("opcija");
    kartica.style.display = "block";
    opcija.style.display = "none";
   }

   const handleClickPayPal = (event) =>{
    const paypal = document.getElementById("paypal");
    const opcija = document.getElementById("opcija");
    paypal.style.display = "block";
    opcija.style.display = "none";
   }
  

  return (
    <>
      {false ? (
        <Navigate to="/" />
      ) : (
        <div style={{display:"flex", justifyContent: "center",  alignItems:"center"}}>
        <Card variant="outlined" sx={{ width: 345, minHeight: "350px" , marginTop: "25vh"}}>
          <CardContent sx={{ display:"flex", flexDirection: "column", alignItems: "center", marginTop:"30px"}}>
            <Typography gutterBottom variant="h5" component="div" sx={{  marginBottom:"45px"}}>
              Dobrodošao Korisnik
            </Typography>
          
            <Typography variant="body2" color="text.secondary" sx={{  marginBottom:"15px"}}>
              Stanje pretplaćenosti: Pretplaćen
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Pretplaćen od: datum
            </Typography>
          </CardContent>
          
          <CardActions sx={{ flexDirection: "column", alignItems:"center", marginTop:"20px" }}>
            <Button size="small">Otkaži pretplatu</Button>
            <Button size="small">Promjeni plaćanje</Button>
          </CardActions>
          
        </Card>
        <Card variant="outlined" sx={{ width: 345, minHeight: "350px" , marginTop: "25vh"}}>
          <CardContent sx={{ display:"flex", flexDirection: "column", alignItems: "center", marginTop:"30px"}}>
            <Typography gutterBottom variant="h5" component="div" sx={{  marginBottom:"45px"}}>
              Dobrodošao Korisnik
            </Typography>
          
            <Typography variant="body2" color="text.secondary" sx={{  marginBottom:"15px"}}>
              Stanje pretplaćenosti: Nema pretplatu
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Cijena: 10$/mth
            </Typography>
          </CardContent>
          
          <CardActions sx={{ flexDirection: "column", alignItems:"center", marginTop:"20px" }}>
            <Button size="small">Pretplati se</Button>
            
          </CardActions>
          
        </Card>
        <Card id="opcija" variant="outlined" sx={{ width: 345, minHeight: "350px" , marginTop: "25vh"}}>
          <CardContent sx={{ display:"flex", flexDirection: "column", alignItems: "center", marginTop:"30px"}}>
            <Typography gutterBottom variant="h5" component="div" sx={{  marginBottom:"45px"}}>
              Odaberite opciju plaćanja
            </Typography>
          
           
          </CardContent>
          
          <CardActions sx={{ flexDirection: "column", alignItems:"center", marginTop:"20px" }}>
            <Button onClick={handleClickCard} size="small">Plati karticom</Button>
            <Button onClick={handleClickPayPal} size="small">Plati pay-palom</Button>
          </CardActions>
          
        </Card>
        <Card id="kartica" variant="outlined" sx={{ width: 345, minHeight: "350px" , marginTop: "25vh", display: "none"}}>
          <CardContent sx={{ display:"flex", flexDirection: "column", alignItems: "center", marginTop:"30px"}}>
            <Typography gutterBottom variant="h5" component="div" sx={{  marginBottom:"45px"}}>
              Plaćanje katicom
            </Typography>
          
            <TextField
          id="outlined-textarea"
          label="Card number"
          placeholder="xxxxxxxxxxxxxxx"
          sx={{  marginBottom:"10px"}}
        />
        <TextField
          id="outlined-textarea"
          label="Card date"
          placeholder="xx/xx"
          
        />
          </CardContent>
          
          <CardActions sx={{ flexDirection: "column", alignItems:"center", marginTop:"5px" }}>
            <Button size="small">Plati</Button>
            
          </CardActions>
          
        </Card>
        <Card id="paypal" variant="outlined" sx={{ width: 345, minHeight: "350px" , marginTop: "25vh", display:"none"}}>
          <CardContent sx={{ display:"flex", flexDirection: "column", alignItems: "center", marginTop:"30px"}}>
            <Typography gutterBottom variant="h5" component="div" sx={{  marginBottom:"45px"}}>
              Plaćanje pay-palom
            </Typography>
          
            <TextField
          id="outlined-textarea"
          label="Paypal username"
          placeholder="Enter paypal username"
          sx={{  marginBottom:"10px"}}
        />
        
          </CardContent>
          
          <CardActions sx={{ flexDirection: "column", alignItems:"center", marginTop:"5px" }}>
            <Button size="small">Plati</Button>
            
          </CardActions>
          
        </Card>
        </div>
        
        
      )}
    </>
  );
}



