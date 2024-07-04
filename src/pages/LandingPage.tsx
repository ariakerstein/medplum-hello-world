import { Anchor, Button, Stack, Text, Title } from '@mantine/core';
import { Document } from '@medplum/react';
import { Link } from 'react-router-dom';

export function LandingPage(): JSX.Element {
  return (
    <Document width={500}>
      <Stack align="center">
        <Title order={2}>Welcome to Prometheus Health!</Title>
        <Text>
          This "Hello World" example demonstrates how to build a simple React application that fetches Patient data from
          Medplum. If you haven't already done so, <Anchor href="https://app.medplum.com/register">register</Anchor> for
          Medplum Project. After that you can sign into your project by clicking the link below.
        </Text>
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          width: '100%',
          marginTop: '20px'
        }}>
          <Button 
            component={Link} 
            to="/signin"
            style={{ marginRight: '10px' }}
          >
            Sign in
          </Button>
          <Button 
            component="a" 
            href="https://app.medplum.com/register"
            target="_blank" 
            rel="noopener noreferrer"
          >
            Register
          </Button>
        </div>
      </Stack>
    </Document>
  );
}