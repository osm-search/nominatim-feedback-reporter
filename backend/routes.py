""" Specifies endpoints for the REST API  """

from controller import store_bugs as _store_bugs


# Dict mapping apis to their classes
routes = {
	'/api/bug': _store_bugs.StoreBugs(),
}
