const { readdirSync } = require('fs');
const ascii = require('ascii-table');

let table = new ascii('Gotoubun Events');
table.setHeading('List', ' Status');

module.exports = client => {
	readdirSync(`./Events/`).forEach(dir => {
		const events = readdirSync(`./Events/${dir}/`).filter(file => file.endsWith(".js"));

		for (let file of events) {
			try {
				let pull = require(`../Events/${dir}/${file}`);

				if (pull.event && typeof pull.event !== 'string') {
					table.addRow(file, `Error ✖`);
					continue;
				}

				pull.event = pull.event || file.replace('.js', '');

				client.on(pull.event, pull.run.bind(null, client));

				table.addRow(file, 'Success ✔');
				// delete require cache pls :))
			} catch (e) {
				console.log(e);
				table.addRow(file, `Error while loading event ✖`);
			}
		}

	});
	console.log(table.toString().rainbow);
};