import React from "react";

export default function RegisterPage() {
  return (
    <div>
      RegisterPage
      <div>
        <form action="/register" method="post">
          <label htmlFor="email">Email: </label>
          <input type="text" name="email"></input>
          <br />
          <label htmlFor="username">Username: </label>
          <input type="text" name="username"></input>
          <br />
          <label htmlFor="password">Password: </label>
          <input type="password" name="password"></input>
          <br />
          <label htmlFor="roleId">Role: </label>
          <input type="text" name="roleId"></input>
          <br />
          <label htmlFor="countryCode">countryCode: </label>
          <input type="text" name="countryCode"></input>
          <br />
          <label htmlFor="firstName">firstName: </label>
          <input type="text" name="firstName"></input>
          <br />
          <label htmlFor="lastName">lastName: </label>
          <input type="text" name="lastName"></input>
          <br />
          <label htmlFor="organizerName">organizerName: </label>
          <input type="text" name="organizerName"></input>
          <br />
          <label htmlFor="profileImage">Profile image: </label>
          <input type="text" name="profileImage"></input>
          <br />
          <input type="submit"></input>
        </form>
      </div>
    </div>
  );
}
