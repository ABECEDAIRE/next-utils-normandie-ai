import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Text,
  Button,
  Row,
  Column,
  Link,
} from "@react-email/components";
import * as React from "react";

export const EventReminder = () => (
  <Html>
    <Head />
    <Preview>
      Votre e-billet pour la journée normande des IA responsables
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src="/images/mail-header.jpeg"
          width="560"
          alt="Event Image"
          style={{ width: "100%", height: "auto" }}
        />
        <Heading style={{ ...heading, textAlign: "center" }}>
          Rendez-vous la semaine prochaine !
        </Heading>
        <Text style={{ ...paragraph, textAlign: "center" }}>
          La journée normande des intelligences artificielles responsables
          arrive la semaine prochaine ! Rendez-vous le 19 décembre dès 8h30 au
          parc des expositions de Rouen.
        </Text>
        <Container style={timerContainer}>
          <Link style={link} href="https://normandie.ai/">
            <Img
              src="/timer.gif"
              width="380"
              height="82.5"
              alt="Event Image"
              style={timerStyle}
            />
          </Link>
        </Container>
        <Hr style={hr} />
        <Heading style={{ ...subheading, textAlign: "center" }}>
          Votre e-billet est en pièce jointe :
        </Heading>
        <Text style={{ ...paragraph, textAlign: "center" }}>
          Afin de faciliter votre arrivée dans le Parc Expo, merci de préparer
          votre e-billet sur votre smartphone. Nous avons régénéré un e-billet
          que vous trouverez en pièce jointe de ce mail, mais il est possible
          que vous ayez déjà reçu un billet via la plateforme Eventbrite. Les
          deux e-billets sont valables pour accéder à l'événement.
        </Text>
        <Text style={{ ...paragraph, textAlign: "center" }}>
          Vous ne pouvez plus venir à l'événement ? Merci de vous désinscrire
          pour céder votre place en{" "}
          <Link
            style={link}
            href="mailto:bonjour@normandie.ai?subject=Demande de désinscription à l'événement&body=Bonjour,
                  Je souhaite me désinscrire de l'événement du 19 décembre. 
                  Merci par avance.
                  Cordialement,"
          >
            cliquant ici.
          </Link>
        </Text>
        <Hr style={hr} />
        <Row>
          <Column>
            <Img
              src="/images/mockup-mail.png"
              width="150"
              alt="Webapp Icon"
              style={{ width: "100%", height: "auto" }}
            />
          </Column>
          <Column>
            <Heading style={subheading}>Webapp de l'événement 📱</Heading>
            <Text style={paragraph}>
              L'application web de l'événement sera prochainement en ligne !
              Parfait pour retrouver le programme, les stands ou encore les
              menus des food-trucks !
            </Text>
            <Button href="https://app.normandie.ai" style={button}>
              app.normandie.ai
            </Button>
          </Column>
        </Row>
        <Row>
          <Column>
            <Img
              src="/images/mockup-mail.png"
              width="150"
              alt="Webapp Icon"
              style={{ width: "100%", height: "auto" }}
            />
          </Column>
          <Column>
            <Heading style={subheading}>Demandez le programme ! 📆</Heading>
            <Text style={paragraph}>
              Le programme complet de l'événement est maintenant disponible.
              Cliquez sur le bouton pour y accéder.
            </Text>
            <Button
              href="https://www.pixel-competences.com/pdf/Programme%20de%20l'%C3%A9v%C3%A9nement.pdf"
              style={button}
            >
              Accéder au programme
            </Button>
          </Column>
        </Row>
        <Row>
          <Column>
            <Img
              src="/images/mockup-mail.png"
              width="150"
              alt="Webapp Icon"
              style={{ width: "100%", height: "auto" }}
            />
          </Column>
          <Column>
            <Heading style={subheading}>Foodtrucks 🍔🥗🥤</Heading>
            <Text style={paragraph}>
              Vous allez vous régaler ! Plusieurs food-trucks seront présents le
              midi de l'événement pour vous permettre de vous restaurer sur
              place.
            </Text>
          </Column>
        </Row>
        <Hr style={hr} />
        <Heading style={{ ...subheading, textAlign: "center" }}>
          Nous sommes impatients de vous rencontrer !
        </Heading>
        <Text style={{ ...paragraph, textAlign: "center" }}>
          Après plus d'un an à penser cette journée et à œuvrer pour rendre
          possible cette première édition, nous sommes plus qu'impatients de
          vous accueillir au Parc des Expositions.
        </Text>
        <Text style={{ ...paragraph, textAlign: "center" }}>
          L'association{" "}
          <Link style={link} href="https://normandie.ai/">
            Normandie.ai
          </Link>{" "}
          est composée de personnes bénévoles motivées par l'objectif commun de
          vous proposer un nouvel événement annuel et responsable sur ce sujet
          passionnant qu'est l'intelligence artificielle.
        </Text>
        <Img
          src="/images/normandie-ai-email.jpg"
          width="250"
          alt="Logo"
          style={{ width: "100%", height: "auto" }}
        />
        <Hr style={hr} />
        <Img
          src="/images/sponsors.png"
          width="560"
          alt="Event Image"
          style={{ width: "100%", height: "auto" }}
        />
        <Container style={footerContainer}>
          <Text style={footer}>
            Vous recevez cet e-mail car vous êtes inscrit à l'événement
            Normandie.ai // La journée normande des intelligences artificielles
            responsables.{" "}
            <a
              href="mailto:bonjour@normandie.ai?subject=Demande de désinscription à l'événement"
              style={{ color: "#ffffff", textDecoration: "underline" }}
            >
              Se désinscrire de l'événement ?
            </a>
          </Text>
        </Container>
      </Container>
    </Body>
  </Html>
);

export default EventReminder;

const main = {
  backgroundColor: "#FAFAFA",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
  padding: "20px",
};

const container = {
  backgroundColor: "#ffffff",
  padding: "20px",
  borderRadius: "5px",
};

const heading = {
  fontSize: "36px",
  fontWeight: "bold",
  color: "#908af6",
};

const subheading = {
  fontSize: "26px",
  fontWeight: "bold",
  color: "#908af6",
};

const paragraph = {
  fontSize: "14px",
  color: "#333333",
  lineHeight: "1.5",
};

const button = {
  backgroundColor: "#bf59f9",
  color: "#ffffff",
  padding: "10px 20px",
  borderRadius: "5px",
  textDecoration: "none",
  fontSize: "16px",
  display: "inline-block",
};

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

const footer = {
  fontSize: "12px",
  color: "#ffffff",
};

const timerContainer = {
  backgroundColor: "#908AF6",
  padding: "15px 0",
};

const timerStyle = {
  margin: "0 auto",
  width: "100%",
  height: "auto",
};

const footerContainer = {
  backgroundColor: "#908AF6",
  padding: "20px",
};

const link = {
  color: "#5C68E2",
  textDecoration: "underline",
};
