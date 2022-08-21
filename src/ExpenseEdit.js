import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import AppNavbar from './AppNavbar';

const ExpenseEdit = () => {
  const initialFormState = {
    name: '',
    amount: '',
    date: '',
    label: ''
  };
  const [expense, setExpense] = useState(initialFormState);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id !== 'new') {
      fetch(`https://expenses-app-zti.herokuapp.com/api/expenses/${id}`)
        .then(response => response.json())
        .then(data => setExpense(data));
    }
  }, [id, setExpense]);

  const handleChange = (event) => {
    const { name, value } = event.target

    setExpense({ ...expense, [name]: value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    expense.label = expense.label.toLowerCase();

    console.log("Expenses:");
    console.log(expense);

    await fetch('https://expenses-app-zti.herokuapp.com/api/expenses' + (expense.id ? '/' + expense.id : ''), {
      method: (expense.id) ? 'PUT' : 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(expense)
    });
    setExpense(initialFormState);
    navigate('/expenses');
  }

  const title = <h2>{expense.id ? 'Edit Expense' : 'Add Expense'}</h2>;

  return (<div>
      <AppNavbar/>
      <Container>
        {title}
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="name">Name</Label>
            <Input type="text" name="name" id="name" value={expense.name || ''}
                   onChange={handleChange} autoComplete="name"/>
          </FormGroup>
          <FormGroup>
            <Label for="amount">Amount</Label>
            <Input type="text" name="amount" id="amount" value={expense.amount || ''}
                   onChange={handleChange} autoComplete="amount"/>
          </FormGroup>
          <FormGroup>
            <Label for="date">Date</Label>
            <Input type="date" name="date" id="date" value={expense.date || ''}
                   onChange={handleChange} autoComplete="date"/>
          </FormGroup>
          <FormGroup>
            <Label for="label">Label</Label>
            <Input type="text" name="label" id="label" value={expense.label || ''}
                   onChange={handleChange} autoComplete="label"/>
          </FormGroup>
          <FormGroup>
            <Button color="primary" type="submit">Save</Button>{' '}
            <Button color="secondary" tag={Link} to="/expenses">Cancel</Button>
          </FormGroup>
        </Form>
      </Container>
    </div>
  )
};

export default ExpenseEdit;