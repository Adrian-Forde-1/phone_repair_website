import React, { useEffect } from 'react';

//react router dom
import { Link } from 'react-router-dom';

function Page404() {
  useEffect(() => {
    var container = document.getElementById('404');
    window.onmousemove = function (e) {
      var x = -e.clientX / 5;
      var y = -e.clientY / 5;
      container.style.backgroundPositionX = x + 'px';
      container.style.backgroundPositionY = y + 'px';
    };
  }, []);
  return (
    <div className="container-404" id="404">
      <div className="content">
        <h2>404</h2>
        <h4>Opps! Page not found</h4>
        <p>The page you are looking for doesn't exist</p>
        <Link to="/">Back To Home</Link>
      </div>
    </div>
  );
}

export default Page404;
