
import React, { useRef, useEffect, useState } from 'react';
import QrScanner from 'qr-scanner';

QrScanner.WORKER_PATH = '/path/to/qr-scanner-worker.min.js';

function Scanner() {
  const [text, setText] = useState('');
  const videoRef = useRef(null);
  const [scannedData, setScannedData] = useState([]); // State variable to store unique roll numbers with scan times
  const [scannerRunning, setScannerRunning] = useState(false); // Flag to track if scanner is running
  const [isBeepPlayed, setIsBeepPlayed] = useState(false); // State variable to track if beep sound has been played


  const qrScannerRef = useRef(null);

  // Create an Audio object for the beep sound
  const beepSound = useRef(new Audio('/beep.mp3')); // Update the path to your beep sound file


  const startScanner = () => {
    if (!scannerRunning && qrScannerRef.current) {
      qrScannerRef.current.start();
      setScannerRunning(true);
    }
  };

  const stopScanner = () => {
    if (scannerRunning && qrScannerRef.current) {
      qrScannerRef.current.stop();
      setScannerRunning(false);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    startScanner();
    console.log("Mail ID:", text);
  };

  useEffect(() => {
    setIsBeepPlayed(false); // Reset beep played state when component mounts or unmounts

    const qrScanner = new QrScanner(
      videoRef.current,
      (result) => {
        console.log('decoded qr code:', result);

        if (!isBeepPlayed) {
          beepSound.current.play(); // Play the beep sound if it hasn't been played yet
          setIsBeepPlayed(true); // Set beep played to true
        }

        const scanTime = new Date().toLocaleTimeString();
        setScannedData((prevData) => {
          // Check if the roll number is already scanned
          if (prevData.find((data) => data.rollno === result.data)) {
            return prevData; // Roll number already exists, do not add again
          }
          return [...prevData, { rollno: result.data, time: scanTime }];
        });
      },
      { returnDetailedScanResult: true }
    );

    qrScannerRef.current = qrScanner;

    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.destroy();
      }
    };
  }, []);

  // Reverse the order of scanned data for rendering
  const scannedDataArray = [...scannedData].reverse();

  const sendEmail = () => {
    const emailData = scannedDataArray.map((data) => `${data.rollno} (${data.time})`).join('\n'); // Combine roll numbers and times
    const mailtoLink = `mailto:${text}?subject=Scanned Roll Numbers&body=${encodeURIComponent(emailData)}`;
    window.location.href = mailtoLink;
  };

  // const shareOnWhatsApp = () => {
  //   const emailData = uniqueRollnosArray.join(', '); // Convert array to comma-separated string
  //   const encodedMessage = encodeURIComponent(emailData);
  //   const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
  //   window.open(whatsappUrl, '_blank');
  // };

  return (
    <div>
      <div className="text-xl text-center h-10 flex justify-center items-center font-semibold bg-[#8AAAE5]">QR Scanner</div>

      <form onSubmit={submitHandler} className="flex justify-center gap-8 pt-8 mx-2">
        <input
          type="text"
          placeholder="Enter your mail ID"
          // size={40}
          className="border w-96 border-black rounded-md px-2 py-1"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <input
          type="submit"
          value='Start'
          className="bg-blue-500 px-4 py-1 rounded-md flex justify-center items-center"
        />
      </form>

    <div className="mt-8 mx-4">
    <video
        ref={videoRef}
        // width="800"
        // height="800"
        autoPlay
        // className="h-72 w-full  "
      ></video>
    </div>
      

      {scannedDataArray.length > 0 && (
        <div className="mx-auto w-full flex flex-col items-center">
          <h2 className="text-xl text-blue-400">Scanned Roll Numbers:</h2>
          <ul className="max-h-[30vh] min-w-fit px-3 overflow-y-auto text-gray-400">
            {scannedDataArray.map((data, index) => (
              <div key={index} className="flex gap-6">
                <li>{data.rollno} ,({data.time})</li>
              </div>
            ))}
          </ul>
          <button
            className="bg-blue-500 px-4 py-1 rounded-md mx-auto flex mt-2"
            onClick={sendEmail}
          >
            Send to Mail
          </button>
          {/* <button onClick={shareOnWhatsApp}>Share on WhatsApp</button> */}
        </div>
      )}
    </div>
  );
}

export default Scanner;


