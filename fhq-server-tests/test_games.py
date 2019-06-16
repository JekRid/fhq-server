#!/usr/bin/env python
# -*- coding: utf-8 -*-

import fhqtest
import libtestgames

try:
    fhqtest.init_enviroment()
    libtestgames.run_tests()
finally:
    fhqtest.deinit_enviroment()