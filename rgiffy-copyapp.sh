set -e

home=`pwd`
#from=${home}/public/apps
from=${home}/target/extension/public/

to=/Users/kavan.puranik/workspace/test-jive-8010/target/jiveHome/www/resources/add-ons/c0e8eebd-6c3a-473e-8be1-676e5e032b6d/d97fffdcee

/usr/bin/rsync --verbose -r --exclude=.svn $from $to
