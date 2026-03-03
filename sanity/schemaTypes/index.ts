// Import everything from the documents folder
import {artistType} from './documents/artistType'
import {eventType} from './documents/eventType'
import {venueType} from './documents/venueType'
import {dataType} from './documents/dataType'
import {newsType} from './documents/newsType'
import {teamType} from './documents/teamType'
import {sponsorType} from './documents/sponsorType'
import {aboutType} from './documents/aboutType'
import {arrangemangType} from './documents/arrangemangType'

// Export them all (you can keep the same order)
export const schemaTypes = [
  artistType, 
  eventType, 
  venueType, 
  dataType, 
  newsType, 
  teamType, 
  sponsorType, 
  aboutType, 
  arrangemangType
]