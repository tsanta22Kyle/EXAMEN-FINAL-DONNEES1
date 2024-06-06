-- #Ma base de données : 

CREATE DATABASE cyber_kumi;

\c cyber_kumi;


CREATE TABLE Clients(
        client_id   Varchar (200) PRIMARY KEY ,
        First_Name     Varchar (200),
        Last_Name     Varchar (200)
       
);




CREATE TABLE stations(
        station_id    Varchar(200) PRIMARY KEY ,
        "session"     Time ,
        "status"     Varchar (100) CHECK(status in ('occuped','free') ),
        "type"     Varchar (200),


      
);



CREATE TABLE Tickets(
        ticket_id  SERIAL PRIMARY KEY  ,
        code     Varchar (100),
        price     INT NOT null,
        duration     Time ,
        client_id_Clients     Varchar (200)
   
);




CREATE TABLE to_use(
        start_time    TimeStamp ,
        client_id_Clients     Varchar (200),
        station_id_stations     Varchar (200),
        ticket_id_Tickets     INT
   
);



ALTER TABLE Tickets ADD CONSTRAINT FK_Tickets_client_id_Clients FOREIGN KEY (client_id_Clients) REFERENCES Clients(client_id);
ALTER TABLE to_use ADD CONSTRAINT clients_fk FOREIGN KEY (client_id_Clients) REFERENCES Clients(client_id);
ALTER TABLE to_use ADD CONSTRAINT station_fk FOREIGN KEY (station_id_stations) REFERENCES stations(station_id);
ALTER TABLE to_use ADD CONSTRAINT ticket_fk FOREIGN KEY (ticket_id_Tickets) REFERENCES Tickets(ticket_id);


-- Supprimer la contrainte existante
ALTER TABLE to_use DROP CONSTRAINT ticket_fk;

-- Ajouter la contrainte avec ON DELETE CASCADE
ALTER TABLE to_use ADD CONSTRAINT ticket_fk FOREIGN KEY (ticket_id_Tickets) REFERENCES Tickets(ticket_id) ON DELETE CASCADE;


--fixer quelques bugs avec les fk contraintes
ALTER TABLE to_use
DROP CONSTRAINT station_fk,
ADD CONSTRAINT station_fk
FOREIGN KEY (station_id_stations)
REFERENCES stations(station_id)
ON DELETE CASCADE;

