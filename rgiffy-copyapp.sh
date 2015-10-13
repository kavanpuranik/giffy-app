set -e

home=`pwd`
from=${home}/public/apps
to=/Users/kavan.puranik/workspace/test-jive-8010/target/jiveHome/www/resources/add-ons/c0e8eebd-6c3a-473e-8be1-676e5e032b6d/3b33066b8c

/usr/bin/rsync --verbose -r --exclude=.svn $from $to
