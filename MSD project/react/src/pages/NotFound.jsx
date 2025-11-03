import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="page page--centered">
      <h1>We lost that reservation</h1>
      <p>The link you followed may be expired. Let’s get you back to discovering great food.</p>
      <Link className="btn btn--primary" to="/">
        Go home
      </Link>
    </div>
  );
}
