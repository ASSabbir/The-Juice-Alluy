import React, { useState } from 'react';

// import TextField from "./components/textField";
// import 'h8k-components';

const title = "Text Append";
const Shop = () => {
   const [firstText, setFirstText] = useState("");
  const [secondText, setSecondText] = useState("");

  return (
    <div>
      <h8k-navbar header={title}></h8k-navbar>
      <div className="layout-row align-items-centre justify-content-center mt-50">
        <section className="layout-column">
          {/* First Text */}
          <div data-testid="first-text" className='bg-green-500'>
            <input
            className='bg-yellow-200'
              labelText="First Text"
              onChange={(e) => setFirstText(e.target.value)}
            />
          </div>

          {/* Second Text */}
          <div data-testid="second-text">
            <input
             className='bg-yellow-200'
              labelText="Second Text"
              onChange={(e) => setSecondText(e.target.value)}
            />
          </div>

          {/* Final Appended Text */}
          <label className="mt-50 text-align-center">
            Appended Text is:
            <label
              className="mt-10 finalText"
              data-testid="final-text"
            >
              {firstText} {secondText}
            </label>
          </label>
        </section>
      </div>
    </div>
  );
}
export default Shop;