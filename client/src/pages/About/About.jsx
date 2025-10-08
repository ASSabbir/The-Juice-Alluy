import React from "react";
import { FiCoffee } from "react-icons/fi";
import { GoClock } from "react-icons/go";
import { FaFacebook, FaGithub, FaLinkedin } from "react-icons/fa";
import dev1 from "../../assets/team/dev1.jpg";
import dev2 from "../../assets/team/dev2.jpg";
import dev3 from "../../assets/team/dev3.jpg";

const About = () => {
  return (
    <div className=" text-white min-h-screen font-urbanist pt-28">
      {/*Restaurant Info*/}
      <section className="px-[10vw] py-16 bg-[url('/bg-2.jpg')] bg-cover bg-center bg-no-repeat">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center items-center gap-2 text-2xl mb-3">
            <FiCoffee className="text-lightCoffee" />
            <h1 className="font-semibold tracking-wider uppercase">About Our Café</h1>
          </div>
          <h1 className="text-5xl md:text-6xl font-moglan mb-6">
            Brewing Joy & Connection Since 2025
          </h1>
          <p className="text-gray-300 leading-relaxed max-w-3xl mx-auto">
            At <span className="text-lightCoffee font-semibold">The Juice Alluy</span>, 
            we believe every sip tells a story. From our carefully sourced coffee beans 
            to our handcrafted beverages, we blend passion, creativity, and community. 
            Whether you’re here to catch up with friends or work on your next big idea, 
            we serve more than just coffee — we serve comfort, inspiration, and warmth.
          </p>

          <div className="mt-10 bg-white text-gray-900 rounded-2xl shadow-lg inline-block text-left px-8 py-6">
            <div className="flex items-center gap-3 mb-3">
              <GoClock className="text-3xl text-lightCoffee" />
              <h2 className="font-semibold text-xl">Opening Hours</h2>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between border-b pb-1">
                <span>Monday - Friday</span>
                <span>09:30 AM - 07:30 PM</span>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span>Saturday</span>
                <span>10:30 AM - 09:30 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday</span>
                <span>Open 24 Hours</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*Developers Info*/}
      <section className="px-[10vw] py-20 bg-zinc-900 text-center">
        <h1 className="text-5xl font-moglan mb-10 text-lightCoffee">
          Meet Our Developers
        </h1>
        <p className="text-gray-400 mb-12 max-w-2xl mx-auto">
          Behind every smooth click and clean design is a passionate developer. 
          Our team of talented creators built this platform with dedication, teamwork, 
          and a love for innovation.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Developer 1 */}
          <div className="bg-zinc-800 rounded-2xl shadow-md p-6 hover:-translate-y-2 duration-300">
            <img src={dev1} alt="Developer 1" className="w-40 h-40 object-cover mx-auto rounded-full border-4 border-lightCoffee" />
            <h2 className="text-2xl mt-4 font-semibold">Abdullah Al Noman</h2>
            <p className="text-gray-400 text-sm mb-4">
              AI & Machine Learning Researcher | Intern Data Scientist @ Data Solution 360 | MERN Stack Developer
            </p>
            <div className="flex justify-center gap-4 text-lightCoffee text-2xl">
              <a href="https://facebook.com" target="_blank"><FaFacebook /></a>
              <a href="https://github.com" target="_blank"><FaGithub /></a>
              <a href="https://linkedin.com" target="_blank"><FaLinkedin /></a>
            </div>
          </div>

          {/* Developer 2 */}
          <div className="bg-zinc-800 rounded-2xl shadow-md p-6 hover:-translate-y-2 duration-300">
            <img src={dev2} alt="Developer 2" className="w-40 h-40 object-cover mx-auto rounded-full border-4 border-lightCoffee" />
            <h2 className="text-2xl mt-4 font-semibold">Atik Al Sabbir</h2>
            <p className="text-gray-400 text-sm mb-4">
              Full Stack Developer | Creative Problem Solver | Animation Enthusiast
            </p>
            <div className="flex justify-center gap-4 text-lightCoffee text-2xl">
              <a href="https://facebook.com" target="_blank"><FaFacebook /></a>
              <a href="https://github.com" target="_blank"><FaGithub /></a>
              <a href="https://linkedin.com" target="_blank"><FaLinkedin /></a>
            </div>
          </div>

          {/* Developer 3 */}
          <div className="bg-zinc-800 rounded-2xl shadow-md p-6 hover:-translate-y-2 duration-300">
            <img src={dev3} alt="Developer 3" className="w-40 h-40 object-cover mx-auto rounded-full border-4 border-lightCoffee" />
            <h2 className="text-2xl mt-4 font-semibold">Mustazir Billah</h2>
            <p className="text-gray-400 text-sm mb-4">
              Web Developer | Crafting Scalable, User-Centric Web Applications with React, SQL, and Modern Technologies
            </p>
            <div className="flex justify-center gap-4 text-lightCoffee text-2xl">
              <a href="https://facebook.com" target="_blank"><FaFacebook /></a>
              <a href="https://github.com" target="_blank"><FaGithub /></a>
              <a href="https://linkedin.com" target="_blank"><FaLinkedin /></a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
