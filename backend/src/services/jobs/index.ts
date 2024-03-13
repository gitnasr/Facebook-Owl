import Agenda from 'agenda';
import {config} from '@/config';
import schedule from './emitter';

const agenda = new Agenda({
	db: {
		address: config.mongoose.url,
		collection: 'jobs',
		options: {}
	},
	maxConcurrency: 20
});

agenda.on('ready', () => {
	schedule.automatedFixer();
	console.log('Agenda started!')
}).on('error', () => console.log('Agenda connection error!'));
agenda.start();
export default agenda;
