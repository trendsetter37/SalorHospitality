# BillGastro -- The innovative Point Of Sales Software for your Restaurant
# Copyright (C) 2011  Michael Franzl <michael@billgastro.com>
# 
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as
# published by the Free Software Foundation, either version 3 of the
# License, or (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.

class SessionsController < ApplicationController

  skip_before_filter :fetch_logged_in_user, :set_locale

  def new
    @users = User.all
    render :layout => 'login'
  end

  def create
    @current_user = User.where(:password => params[:password], :active => true, :hidden => false).first
    if @current_user
      # set these variables for the first time. they will be re-set on each new request by ApplicationController::fetch_logged_in_user
      session[:user_id] = @current_user.id
      @current_company = @current_user.company
      session[:company_id] = @current_company.id
      
      I18n.locale = @current_user.language
      session[:admin_interface] = workstation? # admin panel per default on on workstation
      flash[:error] = nil
      flash[:notice] = t('messages.hello_username', :name => @current_user.login)
      if session[:vendor_id]
        redirect_to orders_path
      else
        session[:vendor_id] = @current_company.vendors.first.id
        redirect_to vendors_path
      end
    else
      flash[:error] = t :wrong_password
      render :new, :layout => 'login'
    end
  end

  def request_specs_login
    create
  end

  def destroy
    @current_user = session[:user_id] = nil
    redirect_to '/session/new'
  end

  def exception_test
    nil.throw_whiny_nil_error_please
  end

  def permission_denied
    render :layout => 'login'
  end

  def catcher
    redirect_to '/session/new'
  end
end
