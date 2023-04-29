import React, { useRef, useState, useEffect } from "react";
import io from "socket.io-client";
import anime from "animejs";
import { getInitialWalletsWithCircleData } from "../client-api";

const DriftingCircles = () => {
  const containerRef = useRef(null);
  const [wallets, setWallets] = useState([]);
  const mounted = useRef(false);
  let circleCount = 0;

  useEffect(() => {
    console.log("DriftingCircles initialized");
    const fetchInitialCircles = async () => {
      if (mounted.current) return; // Skip if the component has already been mounted

      mounted.current = true; // Set the mounted flag to true

      const initialData = await getInitialWalletsWithCircleData();
      console.log("Initial Data:", initialData);
      setWallets(initialData);
      initialData.forEach((walletData) => {
        circleCount++;
        console.log("circleCount: ", circleCount);
        generateCircle(walletData);
      });
    };

    fetchInitialCircles();

    const socket = io("http://localhost:5001");

    socket.on("newWallet", (newWalletData) => {
      generateCircle(newWalletData);
    });
    socket.on("walletStateChanged", (walletId, claimed) => {
      changeStyles(walletId, claimed);
    });
    socket.on("walletDeleted", (walletId) => {
      removeCircle(walletId);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const changeStyles = (walletId) => {
    const circle = document.getElementById(walletId);
    circle.style.backgroundColor = "#F9C2FF";
  };

  const removeCircle = (walletId) => {
    const circle = document.getElementById(walletId);
    if (circle) {
      containerRef.current.removeChild(circle);
    } else {
      console.warn(`Circle with walletId "${walletId}" not found`);
    }
  };

  const generateCircle = (walletData) => {
    console.log("wallet data: ", walletData);
    const circle = document.createElement("div");
    circle.id = walletData._id; // Set the circle's ID to the wallet ID
    circle.style.width = "30px";
    circle.style.height = "30px";
    circle.style.borderRadius = "50%";
    circle.style.border = "2px solid #000000";
    circle.style.backgroundColor =
      walletData.claimed === true ? "#F9C2FF" : "#BFEFFF"; // Set the circle's color based on the wallet data
    circle.style.position = "absolute";

    const containerSize = 400;
    const circleSize = 40;
    const containerWidth = containerSize - circleSize;
    const containerHeight = containerSize - circleSize;
    const initialLeft = Math.random() * containerWidth;
    const initialTop = Math.random() * containerHeight;
    circle.style.left = `${initialLeft}px`;
    circle.style.top = `${initialTop}px`;

    containerRef.current.appendChild(circle);

    anime({
      targets: circle,
      left: [
        { value: `${initialLeft}px`, duration: 0 },
        { value: () => `${Math.random() * containerWidth}px`, duration: 3000 },
        { value: () => `${Math.random() * containerWidth}px`, duration: 3000 },
      ],
      top: [
        { value: `${initialTop}px`, duration: 0 },
        { value: () => `${Math.random() * containerHeight}px`, duration: 3000 },
        { value: () => `${Math.random() * containerHeight}px`, duration: 3000 },
      ],
      loop: true,
      easing: "linear",
      direction: "alternate",
    });
  };

  return (
    <div>
      <div
        ref={containerRef}
        style={{
          width: "50vh",
          height: "40vh",
          position: "relative",
          overflow: "hidden",
          //border: '1px solid black',
          background: "white",
          marginBottom: "10vh",
        }}
      ></div>
    </div>
  );
};

export default DriftingCircles;
