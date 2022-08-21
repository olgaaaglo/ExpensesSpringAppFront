import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup, Container, Table, Form, FormGroup, Input, Label } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';

const ExpensesList = () => {

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sum, setSum] = useState(0);
  const [labels, setLabels] = useState([]);

  const calculateSum = (expenses) => {
    let partSum = 0;
    expenses.forEach(expense => {
      partSum += expense.amount;
    });
    setSum(partSum);
  };

  const compareExpenses = (a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  }

  const unique = (value, index, self) => {
    return self.indexOf(value) === index;
  }

  useEffect(() => {
    setLoading(true);

    fetch('api/expenses')
      .then(response => response.json())
      .then(data => {
        setExpenses(data.sort(compareExpenses));
        setLoading(false);
        calculateSum(data);
        
        let allLabels = data.map(expense => expense.label);//!!!!!!!!!!!
        setLabels(allLabels.filter(unique));
      })
  }, []);

  const remove = async (id) => {
    await fetch(`/api/expenses/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updatedExpenses = [...expenses].filter(i => i.id !== id);
      setExpenses(updatedExpenses);
    });
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  const expensesList = expenses.map(expense => {
    return <tr key={expense.id}>
      <td style={{whiteSpace: 'nowrap'}}>{expense.name}</td>
      <td>{expense.amount}</td>
      <td>{expense.date}</td>
      <td>{expense.label}</td>
      <td>
        <ButtonGroup>
          <Button size="sm" color="primary" tag={Link} to={"/expenses/" + expense.id}>Edit</Button>
          <Button size="sm" color="danger" onClick={() => remove(expense.id)}>Delete</Button>
        </ButtonGroup>
      </td>
    </tr>
  });

  const labelsCheckboxes = labels.map(label => {
    return <FormGroup>
            <Label for={ label }>{ label }</Label>{' '}
            <Input type="checkbox" name={ label } id={ label }
                  autoComplete={ label }/>
          </FormGroup>
  });

  const handleFilter = async (event) => {
    event.preventDefault();
    const date1 = event.target[0];
    const date2 = event.target[1];
    const allLabels = event.target;
    const offset = 2;

    function isInRange(expense) {
      console.log("data ", date1.value);
      console.log("data2 ", date2.value);
      console.log("data ", date1.value == null);
      console.log("data2 ", date2.value == null);
      return (expense.date >= date1.value || date1.value == null) && (date2.value == null || expense.date <= date2.value);
    }

    function areAllUnchecked() {
      for (let i=0; i<labels.length; i++) {
        if (allLabels[i+offset].checked)
          return false;
      }
      return true;
    }

    function isChecked(expense) {
      for (let i=0; i<labels.length; i++) {
        console.log("in loop ", labels[i], expense.label, allLabels[i+offset].checked);
        if (labels[i] === expense.label && allLabels[i+offset].checked)
          return true;
      }
      return false;
    }

    await fetch('api/expenses')
      .then(response => response.json())
      .then(data => {
        let filtered = data.filter(isInRange);
        if (!areAllUnchecked())
          filtered = filtered.filter(isChecked);
        setExpenses(filtered.sort(compareExpenses));
        calculateSum(filtered);
      });
  }

  return (
    <div>
      <AppNavbar/>
      <Container fluid>
        <div className="float-end">
          <Button color="success" tag={Link} to="/expenses/new">Add Expense</Button>
        </div>
        <h3>My expenses list</h3>
        <h4 class="sum">Sum: {sum}</h4>
        <div class="form">
        <Form onSubmit={handleFilter}>
          <h4>Time interval </h4>
            <FormGroup>
              <Label for="date1">From</Label>
              <Input className="w-25" type="date" name="date1" id="date1"
                    autoComplete="date"/>
            </FormGroup>
            <FormGroup>
              <Label for="date2">to</Label>
              <Input className="w-25" type="date" name="date2" id="date2"
                    autoComplete="date" />
            </FormGroup>
          <h4>Filter by labels</h4>
            { labelsCheckboxes }
            <FormGroup>
              <Button color="primary" type="submit">Show</Button>
            </FormGroup>
        </Form>
        </div>
        <Table className="mt-4">
          <thead>
          <tr>
            <th width="20%">Name</th>
            <th width="20%">Amount</th>
            <th width="20%">Date</th>
            <th>Label</th>
            <th width="10%">Actions</th>
          </tr>
          </thead>
          <tbody>
          {expensesList}
          </tbody>
        </Table>
      </Container>
    </div>
  );
};

export default ExpensesList;