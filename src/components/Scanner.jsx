
// import React, { useRef, useEffect, useState } from 'react';
// import QrScanner from 'qr-scanner';

// QrScanner.WORKER_PATH = '/path/to/qr-scanner-worker.min.js';

// function Scanner() {
//   const [text, setText] = useState('');
//   const videoRef = useRef(null);
//   const [uniqueRollnos, setUniqueRollnos] = useState(new Set()); // State variable to store unique roll numbers
//   const [scannerRunning, setScannerRunning] = useState(false); // Flag to track if scanner is running
//   const [time, setTime] = useState([]);

//   const qrScannerRef = useRef(null);

//   const startScanner = () => {
//     if (!scannerRunning && qrScannerRef.current) {
//       qrScannerRef.current.start();
//       setScannerRunning(true);
//     }
//   };

//   const stopScanner = () => {
//     if (scannerRunning && qrScannerRef.current) {
//       qrScannerRef.current.stop();
//       setScannerRunning(false);
//     }
//   };

//   const submitHandler = (e) => {
//     e.preventDefault();
//     startScanner();
//     console.log("Mail ID:", text);
//   };

//   useEffect(() => {
//     const qrScanner = new QrScanner(
//       videoRef.current,
//       (result) => {
//         console.log('decoded qr code:', result);
//         setUniqueRollnos((prevRollnos) => new Set([...prevRollnos, result.data])); // Add the result to the uniqueRollnos set
//         const scanTime = new Date().toLocaleTimeString();
//         setTime((prevTime) => [...prevTime, scanTime]);
//       },
//       { returnDetailedScanResult: true }
//     );

//     qrScannerRef.current = qrScanner;

//     return () => {
//       if (qrScannerRef.current) {
//         qrScannerRef.current.destroy();
//       }
//     };
//   }, []);

//   // Convert Set to array for rendering
//   const uniqueRollnosArray = Array.from(uniqueRollnos).reverse();
//   const timeArray = time.reverse();

//   const sendEmail = () => {
//     const emailData = uniqueRollnosArray.join('\n'); // Convert array to newline-separated string
//     const mailtoLink = `mailto:${text}?subject=Scanned Roll Numbers&body=${encodeURIComponent(emailData)}`;
//     window.location.href = mailtoLink;
//   };

//   // const shareOnWhatsApp = () => {
//   //   const emailData = uniqueRollnosArray.join(', '); // Convert array to comma-separated string
//   //   const encodedMessage = encodeURIComponent(emailData);
//   //   const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
//   //   window.open(whatsappUrl, '_blank');
//   // };

//   return (
//     <div>
//       <div className="text-xl text-center h-10 flex justify-center items-center font-semibold bg-[#8AAAE5]">QR Scanner</div>

//       <form onSubmit={submitHandler} className=" flex justify-center gap-8 pt-8 mx-2">
//         <input
//           type="text"
//           placeholder="Enter your mail ID"
//           // size={40}
//           className="border w-96  border-black rounded-md px-2 py-1"
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//         />
//         <input
//           type="submit"
//           className="bg-blue-500 px-4 py-1 rounded-md  flex justify-center items-center "
//         />
        
//       </form>

//       <video
//         ref={videoRef}
//         width="480"
//         height="800"
//         autoPlay
//         className="h-72 mx-auto mt-8"
//       ></video>

//       {uniqueRollnosArray.length > 0 && (
//         <div className="mx-auto w-full flex flex-col items-center">
//           <h2 className="text-xl text-blue-400">Scanned Roll Numbers:</h2>
//           <ul className="max-h-[30vh] min-w-fit px-3 overflow-y-auto text-gray-400">
//             {uniqueRollnosArray.map((rollno, index) => (
//               <div key={index} className="flex gap-6">
//                 <li>{rollno}</li>
//               </div>
//             ))}
//           </ul>
//           {/* <div>
//             {timeArray.map((timee, index) => (
//               <div key={index}>{timee}</div>
//             ))}
//           </div> */}
//           <button
//             className="bg-blue-500 px-4 py-1 rounded-md mx-auto flex mt-2"
//             onClick={sendEmail}
//           >
//             Send to Mail
//           </button>
//           {/* <button onClick={shareOnWhatsApp}>Share on WhatsApp</button> */}
//         </div>
//       )}
//     </div>
//   );
// }

// export default Scanner;



import React, { useRef, useEffect, useState } from 'react';
import QrScanner from 'qr-scanner';

QrScanner.WORKER_PATH = '/path/to/qr-scanner-worker.min.js';

function Scanner() {
  const [text, setText] = useState('');
  const videoRef = useRef(null);
  const [scannedData, setScannedData] = useState([]); // State variable to store unique roll numbers with scan times
  const [scannerRunning, setScannerRunning] = useState(false); // Flag to track if scanner is running

  const qrScannerRef = useRef(null);

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
    const qrScanner = new QrScanner(
      videoRef.current,
      (result) => {
        console.log('decoded qr code:', result);
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

      <video
        ref={videoRef}
        width="800"
        height="800"
        autoPlay
        className="h-72 w-full  mt-8"
      ></video>

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
