# -*- coding: utf-8 -*-
from setuptools import setup, find_packages
import re, ast
def parse_requirements(filename):
    """ load requirements from a pip requirements file """
    lineiter = (line.strip() for line in open(filename))
    return [line for line in lineiter if line and not line.startswith("#")]

# get version from __version__ variable in shipment_management/__init__.py
_version_re = re.compile(r'__version__\s+=\s+(.*)')

with open('shipment_management/__init__.py', 'rb') as f:
    version = str(ast.literal_eval(_version_re.search(
        f.read().decode('utf-8')).group(1)))

requirements = parse_requirements('requirements.txt')

setup(
	name='shipment_management',
	version=version,
	description='Shipment Application Management',
	author='DigiThinkit Inc.',
	author_email='katerina@digithinkit.com',
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=requirements
)
