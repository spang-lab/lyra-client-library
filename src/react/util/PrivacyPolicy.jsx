import React from 'react';
import { Container, Row, Col } from 'reactstrap';

const PrivacyPolicy = () => (
    <Container fluid >
        <Row>
            <Col sm={{ size: 10, offset: 1 }} >
                <h1 className="pb-2 mt-4 mb-2 border-bottom" >
                    Datenschutz
                </h1>
                <h3> Cookies </h3>
                <p>
                    Diese Webseite verwendet keine Cookies,
                    auch keine externen &quot;third party&quot; cookies.
                </p>
                <h3> Server Log </h3>
                <p>
                    Es werden folgende Daten im Server Log festgehalten:
                </p>
                <ul>
                    <li> Die Ip Adresse des anfordernden Rechners </li>
                    <li> Das Datum und die Uhrzeit der Aufforderung </li>
                    <li> Aufruftyp und Pfad </li>
                    <li> Uebertragungsprotokoll </li>
                    <li> Der verwendete Webbrowser und Betriebsustem (User Agent)</li>
                </ul>
                <p>
                    Die gespeicherten Daten werden ausschlie&szlig;lich zur technischen
                    Zwecken verwendet, z.B zur Diagnose von Fehlern oder zum Blockieren
                    von DDOS Attacken.
                </p>
                <h3>
                    Web Analytics bzw. Tracking
                </h3>
                <p>
                    Tracking oder Web Analytics sind nicht vorhanden.
                    Es werden keine Daten fuer Tracking oder Analytics gesammelt.
                </p>
                <h3> Account Registrierung </h3>
                <p>
                    Nutzer k&ouml;nnen sich auf der Webseite mit einem Account registrieren.
                    Die Dabei eingebenend Daten werden verschl&uuml;sselt &uuml;bertragen und
                    gespeichert. Sie werden nur verwendent um Zugriffsrechte auf genomische
                    Daten zu verwalten.
                    Emails werden nur zur Verifizierung des Accounts gesendet.
                    Eine L&ouml;schung des Accounts erfolgt nach Anfrage sofort, die Daten bestehen
                    aber eventuell bis zu 2 Jahren in Backups der Datenbank.
                </p>
                <h3> Benuzer Login </h3>
                <p>
                    F&uuml;r die Nutzer Authentifizierung nach einem Login werden JSON Web Tokens
                    nach dem Standart
                </p>
                <a href="https://tools.ietf.org/html/rfc7519">
                    RFC 7519
                </a>
                {' '}
                genutzt. Die Tokens werden nur zur Bestimmung von Zurgriffsrechten verwendet,
                und sind im Browsers des Nutzers im sog. &quot;LocalStorage&quot; abgelegt.
                Der Browser garantiert das diese Tokens nur von der selben Domain abgerufen
                werden k&ouml;nnen.
                <h3> Datenschutzbeauftragter </h3>
                <p>
                    Datenschutzbeauftragter der Universit&auml;t Regensburg.
                    <a href="http://www.uni-regensburg.de/universitaet/datenschutzbeauftragte/index.html" >
                        http://www.uni-regensburg.de/universitaet/datenschutzbeauftragte/index.html
                    </a>
                </p>
            </Col>
        </Row>
    </Container>
);

export default PrivacyPolicy;

