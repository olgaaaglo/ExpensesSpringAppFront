// import React, { useEffect, useState } from 'react';
// import logo from './logo.svg';
// import './App.css';

// const App = () => {

//   const [expenses, setExpenses] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     setLoading(true);

//     fetch('api/v1/expenses')
//       .then(response => response.json())
//       .then(data => {
//         setExpenses(data);
//         setLoading(false);
//       })
//   }, []);

//   if (loading) {
//     return <p>Loading...</p>;
//   }

//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <div className="App-intro">
//           <h2>JUG List</h2>
//           {expenses.map(expense =>
//             <div key={expense.id}>
//               {expense.name}
//               {expense.amount}
//               {expense.date}
//               {expense.labels}
//             </div>
//           )}
//         </div>
//       </header>
//     </div>
//   );
// }

// export default App;

import React from 'react';
import './App.css';
import Home from './Home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ExpensesList from './ExpensesList';
import ExpenseEdit from './ExpenseEdit';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home/>}/>
        <Route path='/expenses' exact={true} element={<ExpensesList/>}/>
        <Route path='/expenses/:id' element={<ExpenseEdit/>}/>
      </Routes>
    </Router>
  )
}

export default App;