const { Client } = require("pg");
const prompt = require("prompt-sync")();

const client = new Client({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "tsanta",
  database: "cyber_kumi",
});

// requetes admin
let ticket_this_month = `SELECT COUNT(*) AS tickets_this_month FROM Tickets join to_use on Tickets.ticket_id = to_use.ticket_id_tickets WHERE DATE_PART('month',NOW() - to_use.start_time)=0;`;
let ticket_today = `SELECT COUNT(*) AS tickets_today FROM Tickets join to_use on Tickets.ticket_id = to_use.ticket_id_tickets WHERE DATE_PART('day',NOW() - to_use.start_time)=0;`;
let ticket_this_week = `SELECT COUNT(*) AS tickets_this_week FROM Tickets JOIN to_use ON Tickets.ticket_id = to_use.ticket_id_tickets WHERE EXTRACT(WEEK FROM to_use.start_time) = EXTRACT(WEEK FROM CURRENT_TIMESTAMP);`;
let most_used_ticket = `SELECT ticket_id_Tickets, Tickets.duration, COUNT(ticket_id_Tickets) AS nombre_achats FROM to_use JOIN Tickets ON to_use.ticket_id_Tickets = Tickets.ticket_id GROUP BY ticket_id_Tickets, Tickets.duration ORDER BY nombre_achats DESC LIMIT 1; `;
let stationUsageCounts = `SELECT station_id, COUNT(*) AS usage_count FROM to_use t join stations s on t.station_id_stations = s.station_id GROUP BY station_id  ORDER BY usage_count DESC;`;
let purchase_count = `SELECT code, COUNT(*) AS purchase_count FROM Tickets GROUP BY code ORDER BY purchase_count DESC LIMIT 1;`;
let most_used_type = `SELECT type, COUNT(*) AS usage_count FROM stations JOIN to_use ON stations.station_id = to_use.station_id_stations GROUP BY type ORDER BY usage_count DESC LIMIT 1; `;
let occuped_stations = `SELECT COUNT(*) AS occupied_stations FROM stations WHERE status = 'occuped'; `;
let free_stations = `SELECT COUNT(*) AS free_stations FROM stations WHERE status = 'free'; `;
let most_fidele_client = `SELECT First_name ,COUNT(*) AS visit_count FROM to_use join clients on to_use.client_id_clients = clients.client_id GROUP BY First_name ORDER BY visit_count DESC LIMIT 1;`;
let underrated_station = `SELECT station_id_stations, COUNT(*) AS client_count FROM to_use GROUP BY station_id_stations ORDER BY client_count ASC LIMIT 1;`;
let hours_per_day_of_a_station = `SELECT station_id_stations, ROUND(AVG(EXTRACT(EPOCH FROM duration)) / 3600, 2) AS avg_hours_per_day FROM to_use JOIN Tickets ON to_use.ticket_id_Tickets = Tickets.ticket_id WHERE start_time >= NOW() - INTERVAL '1 day' GROUP BY station_id_stations;`;
let hours_per_week_of_a_station = `SELECT station_id_stations, ROUND(AVG(EXTRACT(EPOCH FROM duration)) / 3600, 2) AS avg_hours_per_week FROM to_use JOIN Tickets ON to_use.ticket_id_Tickets = Tickets.ticket_id WHERE start_time >= NOW() - INTERVAL '1 week' GROUP BY station_id_stations;`;
let min_sold_per_day = ` SELECT start_time::date AS day, COUNT(*) AS tickets_sold FROM Tickets t join to_use u on t.ticket_id = u.ticket_id_tickets GROUP BY start_time::date ORDER BY tickets_sold ASC LIMIT 1; `;
let less_lucrative_day = ` SELECT start_time::date AS day, SUM(price) AS total_revenue FROM Tickets t join to_use u on t.ticket_id = u.ticket_id_tickets GROUP BY start_time::date ORDER BY total_revenue ASC LIMIT 1;`;
let most_lucrative_day = ` SELECT start_time::date AS day, SUM(price) AS total_revenue FROM Tickets t join to_use u on t.ticket_id = u.ticket_id_tickets GROUP BY start_time::date ORDER BY total_revenue DESC LIMIT 1;`;
// let add_machine = `INSERT INTO stations (station_id, "session", "status", "type") VALUES (${id}, ${session}, ${status}, ${type});`
// let add_tickets = `INSERT INTO Tickets (code, price, duration, client_id_Clients) VALUES (${ticket_code}, ${ticket_price}, ${duration}, ${id_client});`

client.connect();

const cyberkumi = () => {
  console.log("╔══════════════════════════════════════════════════════════╗");
  console.log("║             🖥️ Bienvenue au Cybercafé Kumi! 🖥️             ║");
  console.log("╠══════════════════════════════════════════════════════════╣");
  console.log("║ Voulez - vous vous connecter en tant que:                ║");
  console.log("║                                                          ║");
  console.log("║ 1️⃣  Client                                                ║");
  console.log("║ 2️⃣  Gérant du Cybercafé                                   ║");
  console.log(
    "║ 3️⃣  Quitter                                               ║                              ║"
  );
  console.log("║                                                          ║");
  console.log("╚══════════════════════════════════════════════════════════╝");
  let choice = +prompt("  Entrez le numéro de votre choix: ");
  if (choice == 1) {
    clientMenu();
  } else if (choice == 2) {
    const adminPassword = "admin123";
    const inputPassword = prompt("Veuillez entrer le mot de passe admin:");

    if (inputPassword === adminPassword) {
      console.log("----------------------Bienvenue, Admin!--------------------------");
      adminMenu();

      
    } else {
      console.log("Mot de passe incorrect. Accès refusé.");
      endSession();
    }
  } else {
    endSession();
    return 0;
  }
};

const adminMenu = () => {
    
  console.log("╔══════════════════════════════════════════════════════════╗");
  console.log("║       🎉 Bienvenue dans le Système de Gestion du         ║");
  console.log("║          Cybercafé Kumi! 🎉                              ║");
  console.log("╠══════════════════════════════════════════════════════════╣");
  console.log("║ Que souhaitez-vous faire ?                               ║");
  console.log("║                                                          ║");
  console.log("║ 1️⃣  Analyser les ventes de tickets                        ║");
  console.log("║ 2️⃣  Vérifier l'état des ordinateurs                       ║");
  console.log("║ 3️⃣  Statistiques des clients                              ║");
  console.log("║ 4️⃣  Analyser l'utilisation des postes                     ║");
  console.log("║ 5️⃣  Rapport sur les revenus                               ║");
  console.log("║ 6️⃣  ➕ Ajouter des machines                               ║");
  console.log("║ 7️⃣  ➕ Ajouter des types de tickets                       ║");
  console.log("║                                                          ║");
  console.log("╚══════════════════════════════════════════════════════════╝");
  let choice = +prompt("  Entrez le numéro de votre choix: ");
  if (choice == 1) {
    ticketsSales();
  } else if (choice == 2) {
    computerState();
  } else if (choice == 3) {
    clientsStat();
  } else if (choice == 4) {
    stationUse();
  } else if (choice == 5) {
    revenueReport();
  } else if (choice == 6) {
    addStation();
  } else if (choice == 7) {
    addTicketT();
  } else [endSession()];
};

const ticketsSales = () => {
  console.log("╔══════════════════════════════════════════════════════════╗");
  console.log("║          📊 Analyser les ventes de tickets 📊            ║");
  console.log("╠══════════════════════════════════════════════════════════╣");
  console.log("║ 1️⃣  Combien de tickets vendus aujourd'hui ?               ║");
  console.log("║ 2️⃣  Combien de tickets vendus cette semaine ?             ║");
  console.log("║ 3️⃣  Combien de tickets vendus ce mois-ci ?                ║");
  console.log("║ 4️⃣  Quel ticket est le plus acheté ?                      ║");
  console.log("║                                                          ║");
  console.log("╚══════════════════════════════════════════════════════════╝");
  let choice = +prompt("  Choisissez une option pour afficher les rapports: ");
  if (choice == 1) {
    client.query(ticket_today, (err, res) => {
      if (!err) {
        console.log(
          "\n \n╔═══════════════════════════════════════════════════════════════════════════════╗"
        );
        console.log(
          `   le nombre de tickets vendus aujourd'hui : ${res.rows[0].tickets_today} tickets`
        );
        console.log(
          "╚═══════════════════════════════════════════════════════════════════════════════╝"
        );
        adminMenu();
      } else {
        console.error(err.message);
      }
    });
    return 1;
  } else if (choice == 2) {
    client.query(ticket_this_week, (err, res) => {
      if (!err) {
        console.log(
          "\n \n╔═══════════════════════════════════════════════════════════════════════════════╗"
        );
        console.log(
          `   le nombre de tickets vendus cette semaine : ${res.rows[0].tickets_this_week} tickets`
        );
        console.log(
          "╚═══════════════════════════════════════════════════════════════════════════════╝"
        );
        adminMenu();
      } else {
        console.error(err.message);
      }
    });
    return 2;
  } else if (choice == 3) {
    client.query(ticket_this_month, (err, res) => {
      if (!err) {
        console.log(
          "\n \n╔═══════════════════════════════════════════════════════════════════════════════╗"
        );
        console.log(
          `   le nombre de tickets vendus ce mois-ci : ${res.rows[0].tickets_this_month} tickets`
        );
        console.log(
          "╚═══════════════════════════════════════════════════════════════════════════════╝"
        );
        adminMenu();
      } else {
        console.error(err.message);
      }
    });
    return 3;
  } else if (choice == 4) {
    client.query(most_used_ticket, (err, res) => {
      if (!err) {
        if (res.rows.length > 0) {
          const mostUsedTicket = res.rows[0];

          console.log(
            "\n \n╔═══════════════════════════════════════════════════════════════════════════════╗"
          );
          console.log("Ticket le plus utilisé :");
          console.log(`ID du Ticket : ${mostUsedTicket.ticket_id_tickets}`);
          console.log(`Durée du Ticket : ${mostUsedTicket.duration}`);
          console.log(`Nombre d'achats : ${mostUsedTicket.nombre_achats}`);
          console.log(
            "╚═══════════════════════════════════════════════════════════════════════════════╝"
          );
        } else {
          console.log("Aucun ticket trouvé.");
        }
        adminMenu();
      } else {
        console.error(err.message);
      }
    });
    return 4;
  } else {
    adminMenu();
  }
};

const computerState = () => {
  console.log("╔══════════════════════════════════════════════════════════╗");
  console.log("║           🖥️ Vérifier l'état des ordinateurs 🖥️            ║");
  console.log("╠══════════════════════════════════════════════════════════╣");
  console.log("║ 1️⃣  Est-ce qu'un ordinateur ou plusieurs se détériorent   ║");
  console.log("║     plus que d'autres ?                                   ║");
  console.log("║ 2️⃣    Afficher le nombre de postes occupés               ║");
  console.log("║ 3️⃣  Afficher tous les ordinateurs dans la base de données║");
  console.log("║                                                          ║");
  console.log("║                                                          ║");
  console.log("╚══════════════════════════════════════════════════════════╝");
  let choice = +prompt("  Choisissez une option pour afficher les rapports: ");
  if (choice == 1) {
    client.query(stationUsageCounts, (err, res) => {
      if (!err) {
        console.log(
          "\n \n╔═══════════════════════════════════════════════════════════════════════════════╗"
        );
        console.log(`   l'ordi le plus détérioré: ${res.rows[0].station_id} `);
        console.log(
          "╚═══════════════════════════════════════════════════════════════════════════════╝"
        );
        adminMenu();
      } else {
        console.error(err.message);
      }
    });
    return 1;
  } else if (choice == 2) {
    client.query(occuped_stations, (err, res) => {
      if (!err) {
        if (res.rows.length > 0) {
          console.log(
            "\n \n╔═══════════════════════════════════════════════════════════════════════════════╗"
          );
          console.log(
            `   le nombre de postes occupé: ${res.rows[0].occupied_stations} `
          );
          console.log(
            "╚═══════════════════════════════════════════════════════════════════════════════╝"
          );
        }

        adminMenu();
      } else {
        console.error(err.message);
      }
    });
    return 2;
  } else if (choice == 3) {
    client.query(
      `SELECT
    type,
    station_id,
    status,
    "session"
FROM
    stations
ORDER BY
    type;
`,
      (err, res) => {
        if (!err) {
          console.log(
            "\n \n╔═══════════════════════════════════════════════════════════════════════════════╗"
          );
          for (let i = 0; i < res.rows.length; i++) {
            console.log(
              `   ${res.rows[i].type} - ${res.rows[i].station_id} - ${res.rows[i].status} ${res.rows[i].session} `
            );
          }
          console.log(
            "╚═══════════════════════════════════════════════════════════════════════════════╝"
          );
          adminMenu();
        } else {
          console.error(err.message);
        }
      }
    );
    return 2;
  } else {
    adminMenu();
  }
};

const clientsStat = () => {
  console.log("╔══════════════════════════════════════════════════════════╗");
  console.log("║              👥 Statistiques des clients 👥              ║");
  console.log("╠══════════════════════════════════════════════════════════╣");
  console.log("║ 1️⃣  Quel client visite le plus notre établissement ?      ║");
  console.log("║ 2️⃣  Quel poste reçoit le moins de clients ?               ║");
  console.log("║ 3️⃣  Quel client dépense le plus ?                         ║");
  console.log("║                                                          ║");
  console.log("╚══════════════════════════════════════════════════════════╝");
  let choice = +prompt("  Choisissez une option pour afficher les rapports: ");
  if (choice == 1) {
    client.query(most_fidele_client, (err, res) => {
      if (!err) {
        console.log(
          "\n \n╔═══════════════════════════════════════════════════════════════════════════════╗"
        );
        console.log(`   le client le plus fidèle : ${res.rows[0].first_name} `);
        console.log(
          "╚═══════════════════════════════════════════════════════════════════════════════╝"
        );
        adminMenu();
      } else {
        console.error(err.message);
      }
    });
    return 1;
  } else if (choice == 2) {
    client.query(underrated_station, (err, res) => {
      if (!err) {
        console.log(
          "\n \n╔═══════════════════════════════════════════════════════════════════════════════╗"
        );
        console.log(
          `   le poste le moins aimé 💻 : ${res.rows[0].station_id_stations} `
        );
        console.log(
          "╚═══════════════════════════════════════════════════════════════════════════════╝"
        );
        adminMenu();
      } else {
        console.error(err.message);
      }
    });
    return 2;
  } else if (choice == 3) {
    client.query(
      `SELECT
        c.client_id,
        c.first_name,
        c.last_name,
        SUM(t.price) AS total_spent FROM  Clients c  JOIN   Tickets t ON c.client_id = t.client_id_Clients GROUP BY   c.client_id, c.first_name, c.last_name    ORDER BY  total_spent DESC LIMIT 1;`,
      (err, res) => {
        if (!err) {
          console.log(
            "\n \n╔═══════════════════════════════════════════════════════════════════════════════╗"
          );
          console.log(
            `   le client le plus généreux : ${res.rows[0].first_name} `
          );
          console.log(
            "╚═══════════════════════════════════════════════════════════════════════════════╝"
          );
          adminMenu();
        } else {
          console.error(err.message);
        }
      }
    );
    return 3;
  } else {
    adminMenu();
  }
};

const stationUse = () => {
  console.log("╔══════════════════════════════════════════════════════════╗");
  console.log("║           💻 Analyser l'utilisation des postes 💻        ║");
  console.log("╠══════════════════════════════════════════════════════════╣");
  console.log("║ 1️⃣  Quel type de poste est le plus utilisé ?              ║");
  console.log("║ 2️⃣  Moyenne de temps passé sur chaque ordi par jour ?     ║");
  console.log("║ 3️⃣  Moyenne de temps passé sur chaque ordi par semaine ?  ║");
  console.log("║                                                          ║");
  console.log("╚══════════════════════════════════════════════════════════╝");
  let choice = +prompt("  Choisissez une option pour afficher les rapports: ");
  if (choice == 1) {
    client.query(most_used_type, (err, res) => {
      if (!err) {
        console.log(
          "\n \n╔═══════════════════════════════════════════════════════════════════════════════╗"
        );
        console.log(
          `   le type de poste préféré des clients : ${res.rows[0].type} `
        );
        console.log(
          "╚═══════════════════════════════════════════════════════════════════════════════╝"
        );
        adminMenu();
      } else {
        console.error(err.message);
      }
    });
    return 1;
  } else if (choice == 2) {
    client.query(hours_per_day_of_a_station, (err, res) => {
      if (!err) {
        console.log(
          "\n \n╔═══════════════════════════════════════════════════════════════════════════════╗"
        );
        for (let i = 0; i < res.rows.length; i++) {
          console.log(
            `   ${res.rows[i].station_id_stations}  ----  ${res.rows[i].avg_hours_per_day} heures par jour `
          );
        }
        console.log(
          "╚═══════════════════════════════════════════════════════════════════════════════╝"
        );
        adminMenu();
      } else {
        console.error(err.message);
      }
    });
    return 2;
  } else if (choice == 3) {
    client.query(hours_per_week_of_a_station, (err, res) => {
      if (!err) {
        console.log(
          "\n \n╔═══════════════════════════════════════════════════════════════════════════════╗"
        );
        for (let i = 0; i < res.rows.length; i++) {
          console.log(
            `   ${res.rows[i].station_id_stations}  ----  ${res.rows[i].avg_hours_per_week} heures par semaines `
          );
        }
        console.log(
          "╚═══════════════════════════════════════════════════════════════════════════════╝"
        );
        adminMenu();
      } else {
        console.error(err.message);
      }
    });
    return 3;
  } else {
    adminMenu();
  }
};

const revenueReport = () => {
  console.log("╔══════════════════════════════════════════════════════════╗");
  console.log("║              💰 Rapport sur les revenus 💰               ║");
  console.log("╠══════════════════════════════════════════════════════════╣");
  console.log("║ 1️⃣  Afficher le minimum de billets vendus par jour        ║");
  console.log("║ 2️⃣  Afficher quel jour le moins lucratif                  ║");
  console.log(
    "║ 3️⃣  le jour  le plus   lucratif                                             ║"
  );
  console.log("║                                                          ║");
  console.log("╚══════════════════════════════════════════════════════════╝");
  let choice = +prompt("  Choisissez une option pour afficher les rapports: ");
  if (choice == 1) {
    client.query(min_sold_per_day, (err, res) => {
      if (!err) {
        console.log(
          "╔══════════════════════════════════════════════════════════╗"
        );
        console.log(
          `   le minimum de billets vendus par jour : ${res.rows[0].tickets_sold}`
        );
        console.log(
          "╚══════════════════════════════════════════════════════════╝"
        );
      }
    });
    return 1;
  } else if (choice == 2) {
    client.query(less_lucrative_day, (err, res) => {
      if (!err) {
        console.log(
          "╔══════════════════════════════════════════════════════════╗"
        );
        console.log(`   le jour le moins lucratif    : ${res.rows[0].day}`);
        console.log(
          "╚══════════════════════════════════════════════════════════╝"
        );
      }
    });
    return 2;
  } else if (choice == 3) {
    client.query(most_lucrative_day, (err, res) => {
      if (!err) {
        console.log(
          "╔══════════════════════════════════════════════════════════╗"
        );
        console.log(`   le jour le plus lucratif      : ${res.rows[0].day}`);
        console.log(
          "╚══════════════════════════════════════════════════════════╝"
        );
      }
    });
    return 3;
  } else {
    adminMenu();
  }
};

const addStation = () => {
adminFunctionality()
async function updateStation(stationId, session, status, type) {
  const updateStationQuery = `
    UPDATE stations
    SET session = $2, status = $3, type = $4
    WHERE station_id = $1;
  `;
  await client.query(updateStationQuery, [stationId, session, status, type]);
  console.log(`Station ${stationId} mise à jour avec succès.`);
}

async function adminFunctionality() {
  console.log("╔══════════════════════════════════════════════════════════╗");
  console.log("║            ➕ Ajouter des Machines ➕                   ║");
  console.log("╠══════════════════════════════════════════════════════════╣");
  console.log("║ 1️⃣  Ajouter une nouvelle station                         ║");
  console.log("║ 2️⃣  Mettre à jour les informations d'une station         ║");
  console.log("║ 3️⃣  Supprimer une station                                ║");
  console.log("║ 4️⃣  Voir toutes les stations                             ║");
  console.log("║ 5️⃣  Quitter                                              ║");
  console.log("╚══════════════════════════════════════════════════════════╝");

  const choice = prompt("Entrez le numéro de votre choix: ");

  switch (choice) {
    case '1':
      await addNewStation();
      break;
    case '2':
      await updateStationInfo();
      break;
    case '3':
      await deleteStation();
      break;
    case '4':
      await viewAllStations();
      break;
    case '5':
      console.log("Déconnexion...");
      await client.end();
      return;
    default:
      console.log("Choix invalide. Veuillez réessayer.");
      break;
  }
  adminFunctionality();
}

async function addNewStation() {
  const stationId = prompt("Entrez l'ID de la station: ");
  const session = prompt("Entrez la session (format HH:MM:SS): ");
  const status = prompt("Entrez le statut ('occupé' ou 'libre'): ");
  const type = prompt("Entrez le type de la station: ");

  const addStationQuery = `
    INSERT INTO stations (station_id, session, status, type)
    VALUES ($1, $2, $3, $4);
  `;

  await client.query(addStationQuery, [stationId, session, status, type]);
  console.log(`Station ${stationId} ajoutée avec succès.`);
}

async function updateStationInfo() {
  const stationId = prompt("Entrez l'ID de la station à mettre à jour: ");
  const session = prompt("Entrez la nouvelle session (format HH:MM:SS): ");
  const status = prompt("Entrez le nouveau statut ('occupé' ou 'libre'): ");
  const type = prompt("Entrez le nouveau type de la station: ");
  if(stationId=="" || session=="" || status=="" || type==""){
    adminFunctionality()
  }

  await updateStation(stationId, session, status, type);
}

async function deleteStation() {
  const stationId = prompt("Entrez l'ID de la station à supprimer: ");

  const deleteStationQuery = `
    DELETE FROM stations
    WHERE station_id = $1;
  `;

  await client.query(deleteStationQuery, [stationId]);
  console.log(`Station ${stationId} supprimée avec succès.`);
}

async function viewAllStations() {
  const viewStationsQuery = `
    SELECT * FROM stations;
  `;

  const result = await client.query(viewStationsQuery);
  console.table(result.rows);
}

async function main() {
  try {
    await client.connect();
    loginPrompt();
  } catch (err) {
    console.error('Erreur lors de la connexion à la base de données:', err.message);
  }
}



};


// const addTicketT = () => {
//   console.log("╔══════════════════════════════════════════════════════════╗");
//   console.log("║              ➕ Ajouter des Types de Tickets ➕          ║");
//   console.log("╠══════════════════════════════════════════════════════════╣");
//   console.log("║ 1️⃣  Ajouter un nouveau type de ticket                     ║");
//   console.log("║ 2️⃣  Supprimer un type de ticket existant                  ║");
//   console.log("║ 3️⃣  Mettre à jour les informations d'un type de ticket    ║");
//   console.log("║                                                          ║");
//   console.log("╚══════════════════════════════════════════════════════════╝");
//   let choice = +prompt("  Choisissez une option pour afficher les rapports: ");
//   if (choice == 1) {
//     return 1;
//   } else if (choice == 2) {
//     return 2;
//   } else if (choice == 3) {
//     return 3;
//   } else {
//     adminMenu();
//   }
// };

const addTicketT = () => {
  adminTicket()
async function addTicket() {
    try {
      const ticketCode = prompt('Entrez le code du ticket : ');
      const ticketPrice = prompt('Entrez le prix du ticket : ');
      const ticketDuration = prompt('Entrez la durée du ticket (ex: 30 minutes) : ');
      const clientId = prompt('Entrez l\'ID du client associé (si applicable) : ');
  
      const query = `
        INSERT INTO Tickets (code, price, duration, client_id_clients)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `;
  
      const values = [ticketCode, ticketPrice, ticketDuration, clientId];
      const result = await client.query(query, values);
  
      console.log('Ticket ajouté avec succès :', result.rows[0]);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du ticket :', error.message);
    }
  }
  
  async function deleteTicket() {
    try {
      const ticketId = prompt('Entrez l\'ID du ticket à supprimer : ');
  
      const query = `
        DELETE FROM Tickets
        WHERE ticket_id = $1
        RETURNING *;
      `;
  
      const result = await client.query(query, [ticketId]);
  
      if (result.rowCount > 0) {
        console.log('Ticket supprimé avec succès :', result.rows[0]);
      } else {
        console.log('Aucun ticket trouvé avec cet ID.');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du ticket :', error.message);
    }
  }
  
  async function adminTicket() {
    let exit = false;
  
    while (!exit) {
      console.log(`
  ╔══════════════════════════════════════════════════════════╗
  ║            🎟️ Menu Admin - Gestion des Tickets 🎟️      ║
  ╠══════════════════════════════════════════════════════════╣
  ║ 1️⃣  Ajouter un ticket                                    ║
  ║ 2️⃣  Supprimer un ticket                                  ║
  ║ 3️⃣  Retourner au menu principal                          ║
  ║ 4️⃣  Quitter                                              ║
  ╚══════════════════════════════════════════════════════════╝
      `);
  
      const choice = prompt('Entrez le numéro de votre choix : ');
  
      switch (choice) {
        case '1':
          await addTicket();
          break;
        case '2':
          await deleteTicket();
          break;
        case '3':
           return adminMenu();
        case '4':
          endSession();
          break;
        default:
          console.log('Choix invalide. Veuillez réessayer.');
      }
    }
  }
};

const buyTicket = () => {
  console.log("╔══════════════════════════════════════════════════════════╗");
  console.log("║             🖥️ Bienvenue au Cybercafé Kumi! 🖥️             ║");
  console.log("╠══════════════════════════════════════════════════════════╣");
  console.log("║ Choisissez le type de poste :                            ║");
  console.log("║                                                          ║");
  console.log("║ 1️⃣  PC Gaming                                             ║");
  console.log("║ 2️⃣  PC Normal                                             ║");
  console.log("║                                                          ║");
  console.log("╚══════════════════════════════════════════════════════════╝");
  let choice = +prompt("  Entrez le numéro de votre choix: ");
  if (choice == 2) {
    typeNormal();
  } else if (choice == 1) {
    typeGaming();
  }
};

const typeNormal = () => {
  //   let choice = +prompt("  Entrez le numéro de votre choix: ");
  //   if (choice == 1 || choice == 2 || choice == 3 || choice == 4) {
  async function addClient(firstName, lastName) {
    const clientId = Math.random().toString(36).substring(2, 15); // Générer un ID unique pour le client
    const insertClientQuery = `
      INSERT INTO Clients (client_id, first_name, last_name)
      VALUES ($1, $2, $3)
      RETURNING client_id;
    `;

    const result = await client.query(insertClientQuery, [
      clientId,
      firstName,
      lastName,
    ]);
    return result.rows[0].client_id;
  }

  async function addTicket(clientId, duration, price) {
    const ticketCode = Math.random().toString(36).substring(2, 15); // Générer un code de ticket unique
    const insertTicketQuery = `
      INSERT INTO Tickets (code, price, duration, client_id_Clients)
      VALUES ($1, $2, $3, $4)
      RETURNING ticket_id;
      `;

    const result = await client.query(insertTicketQuery, [
      ticketCode,
      price,
      duration,
      clientId,
    ]);
    return result.rows[0].ticket_id;
  }

  async function main() {
    try {
      // Collecte des informations du client
      const firstName = prompt("Veuillez entrer votre prénom: ");
      const lastName = prompt("Veuillez entrer votre nom de famille: ");

      // Ajout du client à la base de données
      const clientId = await addClient(firstName, lastName);
      console.log(`Client ajouté avec succès avec l'ID: ${clientId}`);

      // Collecte des informations du ticket
      //   console.log(`Choisissez la durée de la session:
      //   1. 15 minutes
      //   2. 30 minutes
      //   3. 1 heure
      //   4. 2 heures
      //   Tapez le chiffre correspondant à votre choix:`);
      console.log(
        "╔══════════════════════════════════════════════════════════╗"
      );
      console.log(
        "║             💻 Type de Poste : PC Normal 💻              ║"
      );
      console.log(
        "╠══════════════════════════════════════════════════════════╣"
      );
      console.log(
        "║ Choisissez la durée de votre session :                   ║"
      );
      console.log(
        "║                                                          ║"
      );
      console.log(
        "║ 1️⃣  15 minutes - 500 Ar                                   ║"
      );
      console.log(
        "║ 2️⃣  30 minutes - 1000 Ar                                    ║"
      );
      console.log(
        "║ 3️⃣  1 heure - 1500 Ar                                      ║"
      );
      console.log(
        "║ 4️⃣  2 heures - 2500 Ar                                      ║"
      );
      console.log(
        "║                                                          ║"
      );
      console.log(
        "╚══════════════════════════════════════════════════════════╝"
      );

      const sessionDurationChoice = prompt(
        "veuillez tapez la durée de votre choix :"
      );

      let duration;
      let price;
      switch (sessionDurationChoice) {
        case "1":
          duration = "00:15:00";
          price = 500;
          break;
        case "2":
          duration = "00:30:00";
          price = 1000;
          break;
        case "3":
          duration = "01:00:00";
          price = 1500;
          break;
        case "4":
          duration = "02:00:00";
          price = 2500;
          break;
        default:
          console.log("Durée invalide. Veuillez réessayer.");
          return;
      }

      // Ajout du ticket à la base de données
      const ticketId = await addTicket(clientId, duration, price);
      console.log(`Ticket créé avec succès avec l'ID: ${ticketId}`);

      console.log(
        `Vous avez acheté une session de ${duration} pour ${price} ariary.`
      );
      console.log(`Votre code de ticket est: ${ticketId}`);
    } catch (err) {
      console.error(
        "Erreur lors de l'ajout du client ou de l'achat du ticket:",
        err.message
      );
    } finally {
      await purchaseConfirmed();
    }
  }

  main();

  // purchaseMenu();
  //   } else {
  //     return 0;
  //   }
};

const typeGaming = () => {
  // let choice = +prompt("  Entrez le numéro de votre choix: ");
  // if (choice == 1 || choice == 2 || choice == 3 || choice == 4) {
  async function addClient(firstName, lastName) {
    const clientId = Math.random().toString(36).substring(2, 15); // Générer un ID unique pour le client
    const insertClientQuery = `
        INSERT INTO Clients (client_id, first_name, last_name)
        VALUES ($1, $2, $3)
        RETURNING client_id;
      `;

    const result = await client.query(insertClientQuery, [
      clientId,
      firstName,
      lastName,
    ]);
    return result.rows[0].client_id;
  }

  async function addTicket(clientId, duration, price) {
    const ticketCode = Math.random().toString(36).substring(2, 15); // Générer un code de ticket unique
    const insertTicketQuery = `
        INSERT INTO Tickets (code, price, duration, client_id_Clients)
        VALUES ($1, $2, $3, $4)
        RETURNING ticket_id;
        `;

    const result = await client.query(insertTicketQuery, [
      ticketCode,
      price,
      duration,
      clientId,
    ]);
    return result.rows[0].ticket_id;
  }

  async function main() {
    try {
      // Collecte des informations du client
      const firstName = prompt("Veuillez entrer votre prénom: ");
      const lastName = prompt("Veuillez entrer votre nom de famille: ");

      // Ajout du client à la base de données
      const clientId = await addClient(firstName, lastName);
      console.log(`Client ajouté avec succès avec l'ID: ${clientId}`);

      // Collecte des informations du ticket
      //   console.log(`Choisissez la durée de la session:
      //   1. 15 minutes
      //   2. 30 minutes
      //   3. 1 heure
      //   4. 2 heures
      //   Tapez le chiffre correspondant à votre choix:`);
      console.log(
        "╔══════════════════════════════════════════════════════════╗"
      );
      console.log(
        "║             🎮 Type de Poste : PC Gaming 🎮              ║"
      );
      console.log(
        "╠══════════════════════════════════════════════════════════╣"
      );
      console.log(
        "║ Choisissez la durée de votre session :                   ║"
      );
      console.log(
        "║                                                          ║"
      );
      console.log(
        "║ 1️⃣  15 minutes - 1000 Ar                                   ║"
      );
      console.log(
        "║ 2️⃣  30 minutes - 2000 Ar                                    ║"
      );
      console.log(
        "║ 3️⃣  1 heure - 3000 Ar                                      ║"
      );
      console.log(
        "║ 4️⃣  2 heures - 4000 Ar                                      ║"
      );
      console.log(
        "║                                                          ║"
      );
      console.log(
        "╚══════════════════════════════════════════════════════════╝"
      );

      const sessionDurationChoice = prompt(
        "veuillez tapez la durée de votre choix :"
      );

      let duration;
      let price;
      switch (sessionDurationChoice) {
        case "1":
          duration = "00:15:00";
          price = 1000;
          break;
        case "2":
          duration = "00:30:00";
          price = 2000;
          break;
        case "3":
          duration = "01:00:00";
          price = 3000;
          break;
        case "4":
          duration = "02:00:00";
          price = 4000;
          break;
        default:
          console.log("Durée invalide. Veuillez réessayer.");
          return;
      }

      // Ajout du ticket à la base de données
      const ticketId = await addTicket(clientId, duration, price);
      console.log(`Ticket créé avec succès avec l'ID: ${ticketId}`);

      console.log(
        `Vous avez acheté une session de ${duration} pour ${price} ariary.`
      );
      console.log(`Votre code de ticket est: ${ticketId}`);
    } catch (err) {
      console.error(
        "Erreur lors de l'ajout du client ou de l'achat du ticket:",
        err.message
      );
    } finally {
      await purchaseConfirmed();
    }
  }

  main();

  // purchaseMenu();
  // } else {
  //   return 0;
  // }
};

const purchaseMenu = () => {
  console.log("╔══════════════════════════════════════════════════════════╗");
  console.log(
    `║             ⏰   Durée de Session:                           ⏰      ║`
  );
  console.log("╠══════════════════════════════════════════════════════════╣");
  console.log("║ Que souhaitez - vous faire ensuite ?                     ║");
  console.log("║                                                          ║");
  console.log("║ 1️⃣  confirmer mon ticket                                 ║");
  console.log("║ 2️⃣ Obtenir de l'aide ou contacter le personnel             ║");
  console.log("║                                                          ║");
  console.log("║                                                          ║");
  console.log("╚══════════════════════════════════════════════════════════╝");
  let choice = +prompt("  Entrez le numéro de votre choix: ");
  if (choice == 1) {
    purchaseConfirmed();
  } else if (choice == 2) {
    buyTicket();
  } else if (choice == 2) {
    support();
  }
};

const purchaseConfirmed = () => {
  console.log("╔══════════════════════════════════════════════════════════╗");
  console.log("║             🎟️ Confirmation de l'Achat du Ticket 🎟️        ║");
  console.log("╠══════════════════════════════════════════════════════════╣");
  console.log("║ Votre achat a été confirmé avec succès!                  ║");
  console.log("║                                                          ║");
  console.log("║ Merci d'avoir choisi le Cybercafé Kumi pour votre        ║");
  console.log("║ expérience de navigation sur internet.                   ║");
  console.log("║                                                          ║");
  console.log("║ Vous recevrez votre ticket avec le code de connexion     ║");
  console.log("║ par notre système automatique dans quelques instants.    ║");
  console.log("║                                                          ║");
  console.log("║ Que souhaitez-vous faire ensuite ?                       ║");
  console.log("║ 1️⃣  Revenir au menu principal                             ║");
  console.log("║ 2️⃣  Terminer la session et quitter le Cybercafé           ║");
  console.log("║                                                          ║");
  console.log("╚══════════════════════════════════════════════════════════╝");
  let choice = +prompt("  Entrez le numéro de votre choix: ");
  if (choice == 1) {
    cyberkumi();
  } else {
    endSession();
  }
};

const support = () => {
  console.log("╔══════════════════════════════════════════════════════════╗");
  console.log("║             🆘 Aide et Support 🆘                        ║");
  console.log("╠══════════════════════════════════════════════════════════╣");
  console.log("║ Vous avez choisi de contacter le personnel.              ║");
  console.log("║                                                          ║");
  console.log("║ Notre personnel est là pour vous aider.                  ║");
  console.log("║                                                          ║");
  console.log("║ Merci de bien vouloir patienter quelques instants.       ║");
  console.log("║ Un membre de notre équipe sera avec vous sous peu.       ║");
  console.log("║                                                          ║");
  console.log("║ Si vous avez des questions urgentes, vous pouvez         ║");
  console.log("║ également nous appeler au numéro suivant :               ║");
  console.log("║ 📞 01 23 45 67 89                                        ║");
  console.log("║                                                          ║");
  console.log("║ Tapes n'importe quelle nombre pour revenir au            ║");
  console.log("║ menu principal.                                          ║");
  console.log("╚══════════════════════════════════════════════════════════╝");
  let choice = +prompt("  Entrez le numéro de votre choix: ");
  if (choice == 1) {
    cyberkumi();
  } else {
    cyberkumi();
  }
};

const endSession = () => {
  console.log("╔══════════════════════════════════════════════════════════╗");
  console.log("║            🚪 Terminer la Session et Quitter 🚪          ║");
  console.log("╠══════════════════════════════════════════════════════════╣");
  console.log("║ Nous espérons que vous avez passé un bon moment au       ║");
  console.log("║ Cybercafé Kumi! 😊                                       ║");
  console.log("║                                                          ║");
  console.log("║ Merci de votre visite et à bientôt!                      ║");
  console.log("║                                                          ║");
  console.log("╚══════════════════════════════════════════════════════════╝");
  client.end();
  process.exit();
  return;
};

cyberkumi();
