// import React, { useRef, useEffect, useState } from 'react';
// import QrScanner from 'qr-scanner';

// QrScanner.WORKER_PATH = '/path/to/qr-scanner-worker.min.js';

// function Scanner() {
//   const videoRef = useRef(null);
//   const [uniqueRollnos, setUniqueRollnos] = useState(new Set()); // State variable to store unique roll numbers

//   let qrScanner='';

//   const StartScanner=()=>{
//     qrScanner.start();
//   }

//   const StopScanner=()=>{
//     qrScanner.stop();
//   }

//   useEffect(() => {
//     qrScanner = new QrScanner(
//       videoRef.current,
//       result => {
//         console.log('decoded qr code:', result);
//         setUniqueRollnos(prevRollnos => new Set([...prevRollnos, result.data])); // Add the result to the uniqueRollnos set
//       },
//       { returnDetailedScanResult: true }
//     );
     
   
//     // qrScanner.start();

//     return () => {
//       qrScanner.destroy();
//     };
//   }, []);

//   // Convert Set to array for rendering
//   const uniqueRollnosArray = Array.from(uniqueRollnos).reverse();

//   return (
//     <div>
//         <button className=' bg-blue-500 px-4 py-1 rounded-md mx-auto flex justify-center items-center mt-4'
//         onClick={StartScanner}>
//             Start
//         </button>
//         <button className=' bg-blue-500 px-4 py-1 rounded-md mx-auto flex justify-center items-center mt-4' onClick={StopScanner}>Stop</button>
//       {/* <button onClick={Start}>Start</button> */}
//       <video ref={videoRef} width="480" height="800" autoPlay 
//       className=' h-72 mx-auto mt-8 '
//       ></video>

//       <div className=" mx-auto w-full flex flex-col items-center">
//         <h2 className=' text-xl text-blue-400'>Scanned Roll Numbers:</h2>
//         <ul>
//           {uniqueRollnosArray.map((rollno, index) => (
//             <li key={index}>{rollno}</li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }

// export default Scanner;


import React, { useRef, useEffect, useState } from 'react';
import QrScanner from 'qr-scanner';

QrScanner.WORKER_PATH = '/path/to/qr-scanner-worker.min.js';

function Scanner() {
  const videoRef = useRef(null);
  const [uniqueRollnos, setUniqueRollnos] = useState(new Set()); // State variable to store unique roll numbers
  const [scannerRunning, setScannerRunning] = useState(false); // Flag to track if scanner is running

  let qrScanner = '';

  const startScanner = () => {
    if (!scannerRunning && qrScanner) {
      qrScanner.start();
      setScannerRunning(true);
    }
  };

  const stopScanner = () => {
    // if (scannerRunning && qrScanner) {
      qrScanner.stop();
    //   setScannerRunning(false);
    // }
  };

  useEffect(() => {
    qrScanner = new QrScanner(
      videoRef.current,
      result => {
        console.log('decoded qr code:', result);
        setUniqueRollnos(prevRollnos => new Set([...prevRollnos, result.data])); // Add the result to the uniqueRollnos set
      },
      { returnDetailedScanResult: true }
    );

    // Start the scanner immediately when component mounts
    // startScanner();

    return () => {
      // Stop and destroy the scanner when component unmounts
    //   stopScanner();
      qrScanner.destroy();
    };
  }, []);

  // Convert Set to array for rendering
  const uniqueRollnosArray = Array.from(uniqueRollnos).reverse();

  return (
    <div>
      <button
        className='bg-blue-500 px-4 py-1 rounded-md mx-auto flex justify-center items-center mt-4'
        onClick={startScanner}>
        Start
      </button>
      <button
        className='bg-blue-500 px-4 py-1 rounded-md mx-auto flex justify-center items-center mt-4'
        onClick={stopScanner}>
        Stop
      </button>
      <video
        ref={videoRef}
        width="480"
        height="800"
        autoPlay
        className='h-72 mx-auto mt-8'
      ></video>

    {
        uniqueRollnosArray.length>0?(
            <div className="mx-auto w-full flex flex-col items-center">
        <h2 className='text-xl text-blue-400'>Scanned Roll Numbers:</h2>
        <ul className=' max-h-[30vh] min-w-fit px-3 overflow-y-auto text-gray-400'>
          {uniqueRollnosArray.map((rollno, index) => (
            <li key={index}>{rollno}</li>
          ))}
        </ul>
        <button className=' bg-blue-500 px-4 py-1 rounded-md mx-auto flex mt-2 '>Send to Mail</button>
      </div>
        ):(
            <div></div>
        )
    }

      
      
    </div>
  );
}

export default Scanner;

