import React from 'react';
import { Container, Typography, Accordion, AccordionSummary, AccordionDetails, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Faq = () => {
  const faqs = [
    {
      question: "What is a digital Equb?",
      answer: "A digital Equb is an online version of the traditional Ethiopian savings group where members contribute a fixed amount of money at regular intervals and take turns receiving the collected sum."
    },
    {
      question: "How do I join a digital Equb?",
      answer: "You can join a digital Equb by signing up on our platform, verifying your identity, and selecting an Equb group that matches your saving goals and contribution capacity."
    },
    {
      question: "What are the benefits of joining a digital Equb?",
      answer: "Joining a digital Equb allows you to save money regularly, build financial discipline, and access a lump sum of money when it's your turn, all managed securely through our platform."
    },
    {
      question: "How are the contributions collected?",
      answer: "Contributions are collected automatically through our secure payment system. Members can use various payment methods such as bank transfers, mobile payments, or credit cards."
    },
    {
      question: "What happens if a member fails to contribute?",
      answer: "If a member fails to contribute on time, they may incur a penalty or lose their turn to receive the lump sum. Our platform has measures in place to handle such situations and ensure fairness."
    },
    {
      question: "How is the order of receiving the lump sum determined?",
      answer: "The order is typically determined through a draw or mutual agreement among members at the start of the Equb cycle. The order is fixed and transparent to all members."
    },
    {
      question: "Is my money safe?",
      answer: "Yes, your money is safe. Our platform uses secure technology to manage contributions and payouts, and all transactions are encrypted to protect your financial information."
    },
    {
      question: "How can I create my own Equb?",
      answer: "To create your own Equb, you need to register on our platform as a group organizer. Once registered, you can set up your Equb group, invite members, define contribution amounts and intervals, and start saving together."
    }
  ];

  return (
    <Container>
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Frequently Asked Questions (FAQ)
        </Typography>
        {faqs.map((faq, index) => (
          <Accordion key={index}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index}-content`}
              id={`panel${index}-header`}
            >
              <Typography variant="h6">{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                {faq.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Container>
  );
};

export default Faq;
