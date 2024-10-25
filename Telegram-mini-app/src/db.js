// import { database } from './firebase'; // Import the database reference
// import { ref, push, set } from 'firebase/database'; // Modular imports for database operations
// const postData = () => {
//     window.onload = async (e) => {
//         e.preventDefault();
//         console.log("Window Loading 1: " +telegramID);
//         const telegramID = 'tuwelshaikh006'; //new URLSearchParams(window.location.search).get('telegramID');
//         console.log("Window Loading 2: " +telegramID);
//         const userRef = ref(database, 'markCoinMining');
//           const newUserRef = push(userRef);
//           const date = new Date();
//            set(newUserRef, {
//             telegramID,
//                 name: "",
//                 coin: 0,
//                 balance: 0,
//                 level: 1,
//                 startDate: date,
//                 dateCount: 0,
//                 levelPoints: 0,
//                 maxPoints: 100
//           });
//       }
// }
// //module.exports = postData;
// export default postData;