import React from "react";

export default function LoginPage() {
  return (
    <div>
      Login
      <div>
        <form action="/login" method="POST">
          <label htmlFor="username">Username: </label>
          <input type="text" name="username"></input>
          <label htmlFor="password">Password: </label>
          <input type="password" name="password"></input>
          <input type="submit"></input>
        </form>
      </div>
    </div>
  );
}
