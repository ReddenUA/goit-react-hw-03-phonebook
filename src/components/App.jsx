import { Component } from 'react';
import { Container, SectionContainer } from './App.styled';
import { nanoid } from 'nanoid';
import ContactForm from 'components/ContactForm';
import Filter from './Filter';
import ContactList from './ContactList';

export class App extends Component {
  state = {
    contacts: [
      { id: 'id-1', name: 'Rosie Simpson', number: '459-12-56' },
      { id: 'id-2', name: 'Hermione Kline', number: '443-89-12' },
      { id: 'id-3', name: 'Eden Clements', number: '645-17-79' },
      { id: 'id-4', name: 'Annie Copeland', number: '227-91-26' },
    ],
    filter: '',
  };

  componentDidMount() {
    const contacts = localStorage.getItem('contacts');
    const parsedContacts = JSON.parse(contacts);

    if (parsedContacts) {
      this.setState({ contacts: parsedContacts });
    }
  }

  componentDidUpdate(_, prevState) {
    if (this.state.contacts !== prevState.contacts) {
      // console.log('Обновились contacts, записываю contacts в хранилище');
      localStorage.setItem('contacts', JSON.stringify(this.state.contacts));
    }
  }

  addContact = ({ name, number }) => {
    const contact = {
      id: nanoid(),
      name,
      number,
    };

    const normalisedName = name.toLowerCase();

    this.setState(({ contacts }) =>
      contacts.find(contact => contact.name.toLowerCase() === normalisedName)
        ? alert(`${name} is already in contacts`)
        : { contacts: [contact, ...contacts] }
    );
  };

  deleteContact = contactId => {
    this.setState(prevState => ({
      contacts: prevState.contacts.filter(contact => contact.id !== contactId),
    }));
  };

  changeFilter = e => this.setState({ filter: e.currentTarget.value });

  getVisibleContacts = () => {
    const { contacts, filter } = this.state;

    const normalizedFilter = filter.toLowerCase();

    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(normalizedFilter)
    );
  };

  render() {
    const { filter } = this.state;
    const visibleContacts = this.getVisibleContacts();

    return (
      <Container>
        <SectionContainer>
          <h1>Phonebook</h1>
          <ContactForm onSubmit={this.addContact} />
        </SectionContainer>
        <SectionContainer>
          <h2>Contacts</h2>
          <Filter value={filter} onChange={this.changeFilter} />

          <ContactList
            contacts={visibleContacts}
            onDeleteContact={this.deleteContact}
          />
        </SectionContainer>
      </Container>
    );
  }
}
